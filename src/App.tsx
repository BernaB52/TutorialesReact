import React from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  useDisclosure,
  Tooltip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { EmailFormModal } from "./components/email-form-modal";

// Define the email record type
export interface EmailRecord {
  id: string;
  email: string;
  type: string;
  isPrincipal: boolean;
}

export default function App() {
  // State for email records
  const [emailRecords, setEmailRecords] = React.useState<EmailRecord[]>([
    {
      id: "1",
      email: "johndoe@test.com",
      type: "Notificacion",
      isPrincipal: false
    },
    {
      id: "2",
      email: "jane.smith@test.com",
      type: "Notificacion",
      isPrincipal: true
    }
  ]);

  // Modal state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Handle adding a new email record
  const handleAddEmail = (newEmail: Omit<EmailRecord, "id">) => {
    const newRecord: EmailRecord = {
      ...newEmail,
      id: crypto.randomUUID()
    };
    
    setEmailRecords(prev => [...prev, newRecord]);
  };

  // Handle deleting an email record
  const handleDeleteEmail = (id: string) => {
    setEmailRecords(prev => prev.filter(record => record.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Email Management</h1>
        <Button 
          color="primary" 
          onPress={onOpen}
          startContent={<Icon icon="lucide:plus" width={18} />}
        >
          Add Email
        </Button>
      </div>

      <div className="bg-content1 rounded-medium shadow-xs border border-default-200">
        <Table 
          aria-label="Email records table"
          removeWrapper
          classNames={{
            th: "bg-default-50 text-default-700",
          }}
        >
          <TableHeader>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>IS PRINCIPAL</TableColumn>
            <TableColumn width={80}>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No email records available">
            {emailRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.email}</TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.isPrincipal ? "SI" : "NO"}</TableCell>
                <TableCell>
                  <Tooltip content="Delete record">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDeleteEmail(record.id)}
                    >
                      <Icon icon="lucide:trash-2" width={18} />
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EmailFormModal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        onAddEmail={handleAddEmail}
        existingEmails={emailRecords.map(record => record.email)}
      />
    </div>
  );
}