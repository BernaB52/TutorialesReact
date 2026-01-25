import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox
} from "@heroui/react";
import { EmailRecord } from "../App";

interface EmailFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddEmail: (email: Omit<EmailRecord, "id">) => void;
  existingEmails: string[];
}

// Email types for the dropdown
const EMAIL_TYPES = [
  { key: "notification", value: "Notificacion" },
  { key: "marketing", value: "Marketing" },
  { key: "support", value: "Soporte" },
];

export function EmailFormModal({ 
  isOpen, 
  onOpenChange, 
  onAddEmail,
  existingEmails
}: EmailFormModalProps) {
  // Form state
  const [email, setEmail] = React.useState("");
  const [type, setType] = React.useState("Notificacion");
  const [isPrincipal, setIsPrincipal] = React.useState(false);
  
  // Validation state
  const [emailError, setEmailError] = React.useState("");
  
  // Reset form on close
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEmail("");
      setType("Notificacion");
      setIsPrincipal(false);
      setEmailError("");
    }
    onOpenChange(open);
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if email already exists
  const isEmailDuplicate = (email: string): boolean => {
    return existingEmails.includes(email);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate email
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    if (isEmailDuplicate(email)) {
      setEmailError("This email already exists");
      return;
    }
    
    // Add new email record
    onAddEmail({
      email,
      type,
      isPrincipal
    });
    
    // Close modal
    onOpenChange(false);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={handleOpenChange}
      placement="center"
      size="md"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add New Email
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  placeholder="Enter email address"
                  value={email}
                  onValueChange={setEmail}
                  errorMessage={emailError}
                  isInvalid={!!emailError}
                  isRequired
                  autoFocus
                  onBlur={() => {
                    if (email && !validateEmail(email)) {
                      setEmailError("Please enter a valid email address");
                    } else if (email && isEmailDuplicate(email)) {
                      setEmailError("This email already exists");
                    } else {
                      setEmailError("");
                    }
                  }}
                />
                
                <Select
                  label="Email Type"
                  placeholder="Select email type"
                  selectedKeys={[type]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    if (selected) setType(selected);
                  }}
                  isRequired
                >
                  {EMAIL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.value}
                    </SelectItem>
                  ))}
                </Select>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    isSelected={isPrincipal}
                    onValueChange={setIsPrincipal}
                    size="md"
                  >
                    Set as Principal Email
                  </Checkbox>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Add Email
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}