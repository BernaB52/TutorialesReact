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
  Checkbox,
  Card,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { AddEmailModal } from "./components/add-email-modal";

// Define the email record type
interface EmailRecord {
  id: string;
  email: string;
  type: "Notification" | "Derivados" | "Marketing";
  principal: boolean;
}

export default function App() {
  // State for email records
  const [emailRecords, setEmailRecords] = React.useState<EmailRecord[]>([
    {
      id: "1",
      email: "johndoe@test.com",
      type: "Notification",
      principal: true,
    },
    {
      id: "2",
      email: "jane@example.com",
      type: "Marketing",
      principal: false,
    },
  ]);

  // Modal state
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  // Handle adding a new email record
  const handleAddEmail = (newEmail: Omit<EmailRecord, "id">) => {
    // Check if we already have 4 records
    if (emailRecords.length >= 4) {
      return;
    }

    // Generate a new ID
    const newId = (Math.max(0, ...emailRecords.map(record => parseInt(record.id))) + 1).toString();
    
    // Add the new record
    setEmailRecords([...emailRecords, { ...newEmail, id: newId }]);
    
    // Close the modal
    onClose();
  };

  // Handle deleting an email record
  const handleDeleteEmail = (id: string) => {
    setEmailRecords(emailRecords.filter(record => record.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-3xl p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Email Management</h1>
          <Button 
            color="primary" 
            onPress={onOpen}
            isDisabled={emailRecords.length >= 4}
            startContent={<Icon icon="lucide:plus" width={18} />}
          >
            Add Email
          </Button>
        </div>
        
        <Table 
          aria-label="Email records table"
          removeWrapper
          className="w-full"
        >
          <TableHeader>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>PRINCIPAL</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No emails added yet">
            {emailRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.email}</TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>
                  <Checkbox isSelected={record.principal} isReadOnly />
                </TableCell>
                <TableCell>
                  <Button 
                    isIconOnly 
                    size="sm" 
                    variant="light" 
                    color="danger"
                    onPress={() => handleDeleteEmail(record.id)}
                  >
                    <Icon icon="lucide:trash-2" width={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {emailRecords.length >= 4 && (
          <p className="text-sm text-danger mt-2">
            Maximum of 4 email records reached. Delete an existing record to add a new one.
          </p>
        )}
      </Card>

      <AddEmailModal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        onAddEmail={handleAddEmail} 
      />
    </div>
  );
}