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
  addToast
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Email {
  id: string;
  email: string;
  createdAt: Date;
}

export default function App() {
  const [emails, setEmails] = React.useState<Email[]>([]);
  const [currentEmail, setCurrentEmail] = React.useState("");
  const [isValid, setIsValid] = React.useState<boolean | null>(null);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle input change
  const handleEmailChange = (value: string) => {
    setCurrentEmail(value);
    if (value) {
      setIsValid(validateEmail(value));
    } else {
      setIsValid(null);
    }
  };

  // Handle save email
  const handleSave = () => {
    if (!currentEmail || !validateEmail(currentEmail)) {
      setIsValid(false);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (editId) {
        // Update existing email
        setEmails(emails.map(email => 
          email.id === editId ? { ...email, email: currentEmail } : email
        ));
        addToast({
          title: "Email Updated",
          description: `${currentEmail} has been updated successfully.`,
          color: "success"
        });
        setEditId(null);
      } else {
        // Add new email
        const newEmail: Email = {
          id: Date.now().toString(),
          email: currentEmail,
          createdAt: new Date()
        };
        setEmails([...emails, newEmail]);
        addToast({
          title: "Email Added",
          description: `${currentEmail} has been added successfully.`,
          color: "success"
        });
      }
      
      setCurrentEmail("");
      setIsValid(null);
      setIsSubmitting(false);
    }, 600);
  };

  // Handle delete email
  const handleDelete = (id: string, email: string) => {
    setEmails(emails.filter(email => email.id !== id));
    addToast({
      title: "Email Deleted",
      description: `${email} has been removed.`,
      color: "danger"
    });
  };

  // Handle edit email
  const handleEdit = (id: string, email: string) => {
    setCurrentEmail(email);
    setEditId(id);
    setIsValid(true);
  };

  // Handle cancel
  const handleCancel = () => {
    setCurrentEmail("");
    setEditId(null);
    setIsValid(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Email Management</h1>
      
      <div className="bg-content1 p-6 rounded-medium shadow-xs mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Input
            label="Email Address"
            placeholder="Enter email address"
            value={currentEmail}
            onValueChange={handleEmailChange}
            isInvalid={isValid === false}
            errorMessage={isValid === false ? "Please enter a valid email address" : undefined}
            isRequired
            className="flex-1"
            startContent={
              <Icon 
                icon="lucide:mail" 
                className="text-default-400 text-lg"
              />
            }
          />
          <div className="flex gap-2 self-end">
            <Button
              color="primary"
              onPress={handleSave}
              isLoading={isSubmitting}
              isDisabled={!currentEmail || isValid === false}
              startContent={<Icon icon={editId ? "lucide:check" : "lucide:plus"} />}
            >
              {editId ? "Update" : "Save"}
            </Button>
            {(currentEmail || editId) && (
              <Button
                color="danger"
                variant="flat"
                onPress={handleCancel}
                startContent={<Icon icon="lucide:x" />}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-content1 rounded-medium shadow-xs">
        <Table 
          aria-label="Email list"
          removeWrapper
          classNames={{
            th: "bg-default-50 text-default-700",
          }}
        >
          <TableHeader>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>ADDED ON</TableColumn>
            <TableColumn width={150}>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No emails added yet. Add your first email above.">
            {emails.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  {item.createdAt.toLocaleDateString()} {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="primary"
                      onPress={() => handleEdit(item.id, item.email)}
                    >
                      <Icon icon="lucide:edit" className="text-lg" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDelete(item.id, item.email)}
                    >
                      <Icon icon="lucide:trash-2" className="text-lg" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}