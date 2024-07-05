import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingUsers, updateUserRole } from "../reducers/userSlice";
import toast from "react-hot-toast";

const AdminPage = () => {
  const dispatch = useDispatch();
  const pendingUsers = useSelector((state) => state.user.pendingUsers);

  useEffect(() => {
    dispatch(fetchPendingUsers());
  }, [dispatch]);

  const handleRoleChange = (userId, role) => {
    dispatch(updateUserRole({ userId, role })).then((response) => {
      if (response.error) {
        toast.error("Failed to update role");
      } else {
        toast.success("Role updated successfully");
        dispatch(fetchPendingUsers()); // Refresh the list after update
      }
    });
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone No</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone_no}</td>
              <td>
                <select onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="developer">Developer</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleRoleChange(user._id, 'accepted')}>Accept</button>
                <button onClick={() => handleRoleChange(user._id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
