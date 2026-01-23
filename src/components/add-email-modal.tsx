import React from "react";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Checkbox
} from "@heroui/react";

interface EmailRecord {
  email: string;
  type: "Notification" | "Derivados" | "Marketing";
  principal: boolean;
}

interface AddEmailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddEmail: (email: EmailRecord) => void;
}

export function AddEmailModal({ isOpen, onOpenChange, onAddEmail }: AddEmailModalProps) {
  // Form state
  const [email, setEmail] = React.useState("");
  const [type, setType] = React.useState<"Notification" | "Derivados" | "Marketing">("Notification");
  const [principal, setPrincipal] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setEmail("");
      setType("Notification");
      setPrincipal(false);
      setEmailError("");
    }
  }, [isOpen]);

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateEmail(email)) {
      onAddEmail({
        email,
        type,
        principal
      });
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
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
                  type="email"
                  label="Email Address"
                  placeholder="Enter email address"
                  value={email}
                  onValueChange={setEmail}
                  isInvalid={!!emailError}
                  errorMessage={emailError}
                  onBlur={() => validateEmail(email)}
                />
                
                <Dropdown>
                  <DropdownTrigger>
                    <Button 
                      variant="bordered" 
                      className="w-full justify-start"
                    >
                      {type}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="Email type selection"
                    onAction={(key) => setType(key as "Notification" | "Derivados" | "Marketing")}
                    selectionMode="single"
                    selectedKeys={[type]}
                  >
                    <DropdownItem key="Notification">Notification</DropdownItem>
                    <DropdownItem key="Derivados">Derivados</DropdownItem>
                    <DropdownItem key="Marketing">Marketing</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                
                <Checkbox 
                  isSelected={principal}
                  onValueChange={setPrincipal}
                >
                  Set as principal email
                </Checkbox>
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