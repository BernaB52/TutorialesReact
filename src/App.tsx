import React from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Input, 
  Button, 
  Select, 
  SelectItem,
  Card,
  Tooltip,
  addToast
} from "@heroui/react";
import { Icon } from "@iconify/react";

// Define the data structure for our table rows
interface User {
  id: string;
  email: string;
  type: string;
  status: string;
}

// Define the available types and statuses
const userTypes = ["Admin", "User", "Guest"];
const userStatuses = ["Active", "Inactive", "Pending"];

export default function App() {
  // Initial data for the table
  const [users, setUsers] = React.useState<User[]>([
    { id: "1", email: "john@example.com", type: "Admin", status: "Active" },
    { id: "2", email: "sarah@example.com", type: "User", status: "Active" },
    { id: "3", email: "mike@example.com", type: "Guest", status: "Inactive" },
    { id: "4", email: "lisa@example.com", type: "User", status: "Pending" },
  ]);

  // State to track which user is being edited
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  // State for the new user being added
  const [newUser, setNewUser] = React.useState<Omit<User, "id">>({
    email: "",
    type: "User",
    status: "Pending"
  });

  // State to track if we're adding a new user
  const [isAdding, setIsAdding] = React.useState(false);

  // State to track validation errors
  const [emailError, setEmailError] = React.useState<string | null>(null);
  
  // Function to validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError(null);
    }
    
    return isValid;
  };

  // Function to handle editing a user
  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  // Function to handle saving an edited user
  const handleSave = (id: string, updatedUser: Omit<User, "id">) => {
    if (!validateEmail(updatedUser.email)) return;
    
    setUsers(users.map(user => 
      user.id === id ? { ...user, ...updatedUser } : user
    ));
    
    setEditingId(null);
    addToast({
      title: "User Updated",
      description: `User ${updatedUser.email} has been updated successfully.`,
      color: "success"
    });
  };

  // Function to handle deleting a user
  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    addToast({
      title: "User Deleted",
      description: "User has been deleted successfully.",
      color: "danger"
    });
  };

  // Function to handle adding a new user
  const handleAdd = () => {
    if (!validateEmail(newUser.email)) return;
    
    const newId = (Math.max(...users.map(u => parseInt(u.id))) + 1).toString();
    setUsers([...users, { id: newId, ...newUser }]);
    
    // Reset the new user form
    setNewUser({
      email: "",
      type: "User",
      status: "Pending"
    });
    
    setIsAdding(false);
    addToast({
      title: "User Added",
      description: `User ${newUser.email} has been added successfully.`,
      color: "success"
    });
  };

  // Function to handle canceling an edit or add operation
  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setEmailError(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">User Management</h1>
      
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Users</h2>
            {!isAdding && (
              <Button 
                color="primary" 
                onPress={() => setIsAdding(true)}
                startContent={<Icon icon="lucide:plus" width={18} />}
              >
                Add New User
              </Button>
            )}
          </div>
          
          <Table 
            aria-label="User management table"
            removeWrapper
            className="min-w-full"
          >
            <TableHeader>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn className="text-right">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {isAdding && (
                <TableRow key="new-user">
                  <TableCell>
                    <Input
                      value={newUser.email}
                      onValueChange={(value) => setNewUser({...newUser, email: value})}
                      placeholder="Enter email"
                      isInvalid={!!emailError}
                      errorMessage={emailError}
                      onBlur={() => validateEmail(newUser.email)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      selectedKeys={[newUser.type]}
                      onChange={(e) => setNewUser({...newUser, type: e.target.value})}
                      className="w-full"
                    >
                      {userTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      selectedKeys={[newUser.status]}
                      onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                      className="w-full"
                    >
                      {userStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button 
                        color="primary" 
                        size="sm" 
                        onPress={handleAdd}
                        isDisabled={!newUser.email || !!emailError}
                      >
                        Save
                      </Button>
                      <Button 
                        color="danger" 
                        variant="light" 
                        size="sm" 
                        onPress={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {editingId === user.id ? (
                      <Input
                        defaultValue={user.email}
                        onValueChange={(value) => {
                          const updatedUser = users.find(u => u.id === user.id);
                          if (updatedUser) {
                            updatedUser.email = value;
                            setUsers([...users.filter(u => u.id !== user.id), updatedUser]);
                          }
                        }}
                        isInvalid={!!emailError}
                        errorMessage={emailError}
                        onBlur={(e) => validateEmail(e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:mail" className="text-default-500" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === user.id ? (
                      <Select
                        defaultSelectedKeys={[user.type]}
                        onChange={(e) => {
                          const updatedUser = users.find(u => u.id === user.id);
                          if (updatedUser) {
                            updatedUser.type = e.target.value;
                            setUsers([...users.filter(u => u.id !== user.id), updatedUser]);
                          }
                        }}
                        className="w-full"
                      >
                        {userTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </Select>
                    ) : (
                      <span className={`px-2 py-1 rounded-md text-xs ${
                        user.type === "Admin" ? "bg-primary-100 text-primary-700" :
                        user.type === "User" ? "bg-default-100 text-default-700" :
                        "bg-secondary-100 text-secondary-700"
                      }`}>
                        {user.type}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === user.id ? (
                      <Select
                        defaultSelectedKeys={[user.status]}
                        onChange={(e) => {
                          const updatedUser = users.find(u => u.id === user.id);
                          if (updatedUser) {
                            updatedUser.status = e.target.value;
                            setUsers([...users.filter(u => u.id !== user.id), updatedUser]);
                          }
                        }}
                        className="w-full"
                      >
                        {userStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </Select>
                    ) : (
                      <span className={`px-2 py-1 rounded-md text-xs ${
                        user.status === "Active" ? "bg-success-100 text-success-700" :
                        user.status === "Inactive" ? "bg-danger-100 text-danger-700" :
                        "bg-warning-100 text-warning-700"
                      }`}>
                        {user.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {editingId === user.id ? (
                        <>
                          <Button 
                            color="primary" 
                            size="sm" 
                            onPress={() => {
                              const updatedUser = users.find(u => u.id === user.id);
                              if (updatedUser) {
                                handleSave(user.id, {
                                  email: updatedUser.email,
                                  type: updatedUser.type,
                                  status: updatedUser.status
                                });
                              }
                            }}
                            isDisabled={!!emailError}
                          >
                            Save
                          </Button>
                          <Button 
                            color="danger" 
                            variant="light" 
                            size="sm" 
                            onPress={handleCancel}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Tooltip content="Edit user">
                            <Button 
                              isIconOnly 
                              size="sm" 
                              variant="light" 
                              onPress={() => handleEdit(user.id)}
                            >
                              <Icon icon="lucide:edit" className="text-default-500" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Delete user">
                            <Button 
                              isIconOnly 
                              size="sm" 
                              color="danger" 
                              variant="light" 
                              onPress={() => handleDelete(user.id)}
                            >
                              <Icon icon="lucide:trash-2" className="text-danger" />
                            </Button>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}