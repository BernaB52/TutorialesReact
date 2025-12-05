import React from "react";
import { 
  Input, 
  Button, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Select,
  SelectItem,
  Card
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface EmailRecord {
  id: string;
  email: string;
  type: string;
  status: string;
}

export default function App() {
  const [email, setEmail] = React.useState("");
  const [type, setType] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [records, setRecords] = React.useState<EmailRecord[]>([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentId, setCurrentId] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!regex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSave = () => {
    if (!validateEmail(email) || !type || !status) {
      if (!type) setType("Please select a type");
      if (!status) setStatus("Please select a status");
      return;
    }

    if (isEditing && currentId) {
      setRecords(records.map(record => 
        record.id === currentId 
          ? { ...record, email, type, status } 
          : record
      ));
      setIsEditing(false);
      setCurrentId(null);
    } else {
      const newRecord: EmailRecord = {
        id: Date.now().toString(),
        email,
        type,
        status
      };
      setRecords([...records, newRecord]);
    }

    // Reset form
    setEmail("");
    setType("");
    setStatus("");
  };

  const handleEdit = (record: EmailRecord) => {
    setEmail(record.email);
    setType(record.type);
    setStatus(record.status);
    setIsEditing(true);
    setCurrentId(record.id);
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
  };

  const handleCancel = () => {
    setEmail("");
    setType("");
    setStatus("");
    setIsEditing(false);
    setCurrentId(null);
    setEmailError("");
  };

  const typeOptions = ["Personal", "Work", "Other"];
  const statusOptions = ["Active", "Inactive", "Pending"];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6">Email Management</h1>
      
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Email"
            placeholder="Enter email address"
            value={email}
            onValueChange={setEmail}
            errorMessage={emailError}
            isInvalid={!!emailError}
            isRequired
          />
          
          <Select
            label="Type"
            placeholder="Select type"
            selectedKeys={type ? [type] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setType(selected);
            }}
            isRequired
          >
            {typeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
          
          <Select
            label="Status"
            placeholder="Select status"
            selectedKeys={status ? [status] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setStatus(selected);
            }}
            isRequired
          >
            {statusOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button
            color="danger"
            variant="light"
            onPress={handleCancel}
            startContent={<Icon icon="lucide:x" />}
          >
            Cancel
          </Button>
          
          <Button
            color="primary"
            onPress={handleSave}
            startContent={<Icon icon={isEditing ? "lucide:check" : "lucide:plus"} />}
          >
            {isEditing ? "Update" : "Save"}
          </Button>
        </div>
      </Card>
      
      <Card>
        <Table 
          aria-label="Email records table"
          removeWrapper
        >
          <TableHeader>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No records to display">
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.email}</TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>
                  <div className={`px-2 py-1 rounded-full text-xs inline-block
                    ${record.status === "Active" ? "bg-success-100 text-success-600" : 
                      record.status === "Inactive" ? "bg-danger-100 text-danger-600" : 
                      "bg-warning-100 text-warning-600"}`}>
                    {record.status}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      color="primary"
                      variant="light"
                      onPress={() => handleEdit(record)}
                    >
                      <Icon icon="lucide:edit" className="text-lg" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      onPress={() => handleDelete(record.id)}
                    >
                      <Icon icon="lucide:trash-2" className="text-lg" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}