import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

// connect to http://127.0.0.1:5001/api/users and get the data and display it here

const HomePage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      const response = await axios.get("http://127.0.0.1:5001/api/users");
      console.log(response.data);
      setUsers(response.data);
    };
    fetchAPI();
  }, []);

  return (
    <div className="bg-black flex justify-center items-center h-screen">
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id}>
            <h2 className="text-white">{user.name}&nbsp;&nbsp;</h2>
          </div>
        ))
      ) : (
        <h2 className="text-white">No users found</h2>
      )}
    </div>
  );
};

export default HomePage;
