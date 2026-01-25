import React from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  addToast
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { AddressForm } from "./components/address-form";

// Define the Address interface
interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function App() {
  // Sample data for addresses
  const [addresses, setAddresses] = React.useState<Address[]>([
    {
      id: "1",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    {
      id: "2",
      street: "456 Park Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA"
    },
    {
      id: "3",
      street: "789 Maple Rd",
      city: "Chicago",
      state: "IL",
      zipCode: "60007",
      country: "USA"
    }
  ]);

  // Modal state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Handle delete address
  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
    addToast({
      title: "Address Deleted",
      description: "The address has been successfully removed.",
      color: "danger"
    });
  };

  // Handle add new address
  const handleAddAddress = (newAddress: Omit<Address, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setAddresses([...addresses, { ...newAddress, id }]);
    addToast({
      title: "Address Added",
      description: "The new address has been successfully added.",
      color: "success"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Address Management</h1>
        <Button 
          color="primary" 
          onPress={onOpen}
          startContent={<Icon icon="lucide:plus" width={18} />}
        >
          Add New Address
        </Button>
      </div>

      {/* Addresses Table */}
      <div className="bg-content1 rounded-medium shadow-xs">
        <Table 
          aria-label="Addresses table"
          removeWrapper
          className="min-h-[400px]"
        >
          <TableHeader>
            <TableColumn>STREET</TableColumn>
            <TableColumn>CITY</TableColumn>
            <TableColumn>STATE</TableColumn>
            <TableColumn>ZIP CODE</TableColumn>
            <TableColumn>COUNTRY</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No addresses found">
            {addresses.map((address) => (
              <TableRow key={address.id}>
                <TableCell>{address.street}</TableCell>
                <TableCell>{address.city}</TableCell>
                <TableCell>{address.state}</TableCell>
                <TableCell>{address.zipCode}</TableCell>
                <TableCell>{address.country}</TableCell>
                <TableCell>
                  <Button 
                    isIconOnly 
                    color="danger" 
                    variant="light" 
                    size="sm"
                    onPress={() => handleDelete(address.id)}
                    aria-label="Delete address"
                  >
                    <Icon icon="lucide:trash-2" width={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Address Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <AddressForm onSubmit={handleAddAddress} onClose={onClose} />
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}