import React from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  addToast
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface EmailRecord {
  id: string;
  email: string;
  type: "Notification" | "Advise" | "Support";
  status: "Active" | "Inactive";
}

const initialData: EmailRecord[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    type: "Notification",
    status: "Active"
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    type: "Support",
    status: "Active"
  },
  {
    id: "3",
    email: "mike.johnson@example.com",
    type: "Advise",
    status: "Inactive"
  }
];

export const EmailTable: React.FC = () => {
  const [data, setData] = React.useState<EmailRecord[]>(initialData);
  const [isAdding, setIsAdding] = React.useState(false);
  
  // New record form state
  const [newEmail, setNewEmail] = React.useState("");
  const [newType, setNewType] = React.useState<EmailRecord["type"]>("Notification");
  const [newStatus, setNewStatus] = React.useState<EmailRecord["status"]>("Active");
  const [emailError, setEmailError] = React.useState("");
  
  // Email validation function
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    setEmailError(isValid ? "" : "Please enter a valid email address");
    return isValid;
  };
  
  // Handle save new record
  const handleSave = () => {
    if (!validateEmail(newEmail)) {
      return;
    }
    
    const newRecord: EmailRecord = {
      id: Date.now().toString(),
      email: newEmail,
      type: newType,
      status: newStatus
    };
    
    setData([...data, newRecord]);
    resetForm();
    addToast({
      title: "Record added",
      description: `Email ${newEmail} has been added successfully`,
      color: "success"
    });
  };
  
  // Handle delete record
  const handleDelete = (id: string) => {
    const recordToDelete = data.find(record => record.id === id);
    setData(data.filter(record => record.id !== id));
    addToast({
      title: "Record deleted",
      description: `Email ${recordToDelete?.email} has been deleted`,
      color: "danger"
    });
  };
  
  // Reset form and exit adding mode
  const resetForm = () => {
    setNewEmail("");
    setNewType("Notification");
    setNewStatus("Active");
    setEmailError("");
    setIsAdding(false);
  };

  return (
    <div className="bg-content1 rounded-medium shadow-sm border border-default-200">
      <div className="p-4 flex justify-between items-center border-b border-default-200">
        <h2 className="text-xl font-medium">Email Records</h2>
        {!isAdding && (
          <Button 
            color="primary" 
            onPress={() => setIsAdding(true)}
            startContent={<Icon icon="lucide:plus" width={18} />}
          >
            Add New Record
          </Button>
        )}
      </div>
      
      <Table 
        aria-label="Email records table"
        removeWrapper
        className="min-h-[400px]"
      >
        <TableHeader>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn align="center">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {isAdding && (
            <TableRow className="bg-default-50">
              <TableCell>
                <Input
                  value={newEmail}
                  onValueChange={setNewEmail}
                  placeholder="Enter email address"
                  isInvalid={!!emailError}
                  errorMessage={emailError}
                  onBlur={() => validateEmail(newEmail)}
                  autoFocus
                  className="max-w-xs"
                />
              </TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button 
                      variant="flat" 
                      className="capitalize justify-start"
                    >
                      {newType}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Type selection"
                    selectionMode="single"
                    selectedKeys={[newType]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as EmailRecord["type"];
                      if (selected) setNewType(selected);
                    }}
                  >
                    <DropdownItem key="Notification">Notification</DropdownItem>
                    <DropdownItem key="Advise">Advise</DropdownItem>
                    <DropdownItem key="Support">Support</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button 
                      variant="flat" 
                      className="capitalize justify-start"
                      color={newStatus === "Active" ? "success" : "default"}
                    >
                      {newStatus}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Status selection"
                    selectionMode="single"
                    selectedKeys={[newStatus]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as EmailRecord["status"];
                      if (selected) setNewStatus(selected);
                    }}
                  >
                    <DropdownItem key="Active">Active</DropdownItem>
                    <DropdownItem key="Inactive">Inactive</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button 
                    color="primary" 
                    size="sm" 
                    onPress={handleSave}
                    isDisabled={!newEmail || !!emailError}
                    startContent={<Icon icon="lucide:save" width={16} />}
                  >
                    Save
                  </Button>
                  <Button 
                    color="danger" 
                    variant="light" 
                    size="sm" 
                    onPress={resetForm}
                    startContent={<Icon icon="lucide:x" width={16} />}
                  >
                    Cancel
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
          
          {data.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.email}</TableCell>
              <TableCell>
                <span className="inline-flex items-center">
                  <Icon 
                    icon={
                      record.type === "Notification" ? "lucide:bell" : 
                      record.type === "Advise" ? "lucide:info" : 
                      "lucide:help-circle"
                    } 
                    className="mr-2 text-default-500"
                    width={16}
                  />
                  {record.type}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  record.status === "Active" 
                    ? "bg-success-100 text-success-600" 
                    : "bg-default-100 text-default-600"
                }`}>
                  {record.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Button 
                    isIconOnly 
                    color="danger" 
                    variant="light" 
                    size="sm"
                    onPress={() => handleDelete(record.id)}
                    aria-label="Delete record"
                  >
                    <Icon icon="lucide:trash-2" width={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {!isAdding && data.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Icon icon="lucide:inbox" className="text-default-300 mb-4" width={48} height={48} />
          <p className="text-default-500 mb-4">No email records found</p>
          <Button 
            color="primary" 
            onPress={() => setIsAdding(true)}
            startContent={<Icon icon="lucide:plus" width={18} />}
          >
            Add New Record
          </Button>
        </div>
      )}
    </div>
  );
};