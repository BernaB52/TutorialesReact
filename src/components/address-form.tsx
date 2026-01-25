import React from "react";
import { 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Input
} from "@heroui/react";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressFormProps {
  onSubmit: (address: Address) => void;
  onClose: () => void;
}

export function AddressForm({ onSubmit, onClose }: AddressFormProps) {
  // Form state
  const [formData, setFormData] = React.useState<Address>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });

  // Form validation
  const [errors, setErrors] = React.useState<Partial<Record<keyof Address, string>>>({});

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name as keyof Address]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Address, string>> = {};
    let isValid = true;

    // Check required fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key as keyof Address] = "This field is required";
        isValid = false;
      }
    });

    // Zip code validation (simple example)
    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid zip code (e.g., 12345 or 12345-6789)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        Add New Address
      </ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Street Address"
              placeholder="Enter street address"
              name="street"
              value={formData.street}
              onChange={handleChange}
              isInvalid={!!errors.street}
              errorMessage={errors.street}
              autoFocus
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="Enter city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                isInvalid={!!errors.city}
                errorMessage={errors.city}
              />
              <Input
                label="State/Province"
                placeholder="Enter state or province"
                name="state"
                value={formData.state}
                onChange={handleChange}
                isInvalid={!!errors.state}
                errorMessage={errors.state}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Zip/Postal Code"
                placeholder="Enter zip or postal code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                isInvalid={!!errors.zipCode}
                errorMessage={errors.zipCode}
              />
              <Input
                label="Country"
                placeholder="Enter country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                isInvalid={!!errors.country}
                errorMessage={errors.country}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Add Address
          </Button>
        </ModalFooter>
      </form>
    </>
  );
}