import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingUsers, updateUserRole, deleteUser } from "../reducers/userSlice";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AdminPage = () => {
  const dispatch = useDispatch();
  const pendingUsers = useSelector((state) => state.user.pendingUsers);
  const [selectedRole, setSelectedRole] = useState({});

  useEffect(() => {
    dispatch(fetchPendingUsers());
  }, [dispatch]);

  const handleRoleChange = (userId, role) => {
    setSelectedRole((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  const confirmAction = (userId, action) => {
    const user = pendingUsers.find((user) => user._id === userId);
    confirmAlert({
      title: `Confirm ${action === "accept" ? "Accept" : "Reject"}`,
      message: (
        <div>
          <p>
            Are you sure you want to {action === "accept" ? "accept" : "reject"} this user?
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone No:</strong> {user.phone_no}
          </p>
          {action === "accept" && (
            <div>
              <p>
                <strong>Selected Role:</strong> {selectedRole[userId] || "None"}
              </p>
              {!selectedRole[userId] && (
                <p style={{ color: "red" }}>
                  Please select a role before accepting
                </p>
              )}
            </div>
          )}
        </div>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            if (action === "accept" && !selectedRole[userId]) {
              toast.error("Please select a role before accepting.");
              return;
            }
            if (action === "accept") {
              dispatch(updateUserRole({ userId, role: selectedRole[userId] })).then((response) => {
                if (!response.error) {
                  toast.success(`User accepted successfully!`);
                  setSelectedRole((prev) => ({
                    ...prev,
                    [userId]: undefined, // Clear selected role after acceptance
                  }));
                  dispatch(fetchPendingUsers()); // Fetch updated list after action
                } else {
                  toast.error("Failed to accept user");
                }
              });
            } else {
              dispatch(deleteUser(userId)).then((response) => {
                if (!response.error) {
                  toast.success(`User rejected successfully!`);
                  dispatch(fetchPendingUsers()); // Fetch updated list after action
                } else {
                  toast.error("Failed to reject user");
                }
              });
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <div className="mx-5 min-h-screen min-w-max">
      <h1 className="text-2xl font-bold my-4">Pending Users</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone No
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user._id} className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {user.username}
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone_no}</td>
                <td className="px-6 py-4">
                  <select
                    className="px-2 py-1 border rounded"
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value)
                    }
                    value={selectedRole[user._id] || ""}
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => confirmAction(user._id, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => confirmAction(user._id, "reject")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
