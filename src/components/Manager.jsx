import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";
const Manager = () => {
  const host = "https://backend-assignment-production-606d.up.railway.app/auth/";
  const ref = useRef();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    status: "Gold",
    email: "",
    membershipid: "",
  });
  const [passArray, setPassArray] = useState([]);
  const [memArray, setMemArray] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDel, setIddel] = useState();
  const [editId, setEditId] = useState(null);
  const [membership, setMembership] = useState({});
  const fetchUsers = async () => {
    try {
      const res = await axios.get(host);
      setPassArray(res.data);
      const mem = await axios.get("https://backend-assignment-production-606d.up.railway.app/member");
      setMemArray(mem.data);
      
    } catch (error) {
      console.error("Error fetching User Data:", error);
      toast.error("Error fetching User Data");
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const copyText = (params) => {
    navigator.clipboard.writeText(params);
    toast("🦄 Copied", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const saveUser = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      form.firstname.trim() === "" ||
      form.lastname.trim() === "" ||
      form.phonenumber.trim() === "" ||
      form.email.trim() === ""
    ) {
      toast("🦄 Please fill all the fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }

    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }

    const payload = {
      firstname: form.firstname,
      lastname: form.lastname,
      phonenumber: form.phonenumber,
      status: form.status,
      email: form.email,
      membershipid: statusId(form.status),
    };

    try {
      if (editId) {
        await axios.put(`${host}update/${editId}`, payload);
        toast.success("User updated successfully!");
      } else {
        await axios.post(`${host}add`, payload);
        toast.success("user saved successfully!");
      }

      await fetchUsers();
      setForm({
        firstname: "",
        lastname: "",
        phonenumber: "",
        status: "Gold",
        email: "",
      });
      setEditId(null);
    } catch (error) {
      console.error(
        "Error saving User:",
        error.response?.data || error.message
      );
      toast.error("Failed to save User!");
    }
  };

  //     toast("🦄 Please fill all the fields", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "dark",
  //     });
  //     return;
  //   }
  //   console.log(form);
  //   setPassArray([...passArray, { ...form, id: uuidv4() }]);
  //   localStorage.setItem(
  //     "Users",
  //     JSON.stringify([...passArray, { ...form, id: uuidv4() }])
  //   );
  //   // console.log([...passArray, form]);
  //   console.log(localStorage.getItem("Users"));
  //   const payload = {
  //     appname: form.appname, // Change to match backend
  //     username: form.username,
  //     User: form.pass,  // Change to match backend
  //   };
  //   try {
  //     const res = await axios.post("https://backend-User-manager-production.up.railway.app/api/users/register", payload);
  //     console.log(res.data);
  //     toast("🦄 Saved User", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "dark",
  //     });
  //   } catch (error) {
  //     console.error("Error:", error.response?.data || error.message);
  //     toast("🦄 Error", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "dark",
  //     });
  //   }
  //   setForm({ appname: "", username: "", pass: "" });

  // };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const statusId = (status) => {
    if (status.toLowerCase() === "gold") {
      return "STD001";
    } else {
      return "PLT001";
    }
  };
  const deleteHandler = async () => {
    try {
      await axios.delete(`${host}delete/${idDel}`);
      const { data } = await axios.get(host);
      setPassArray(data);
      setIsModalOpen(false);
      toast("🦄 Deleted User", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error("Error deleting User:", error);
      toast.error("Error deleting User");
    }
  };
  const editHandler = (id) => {
    const selectedItem = passArray.find((item) => item._id === id);
    if (!selectedItem) return; // Prevent errors if the item is not found

    setForm({
      firstname: selectedItem.firstname,
      lastname: selectedItem.lastname,
      phonenumber: selectedItem.phonenumber,
      status: selectedItem.status,
      email: selectedItem.email,
      membershipid: selectedItem.membershipid,
    });
    setEditId(id);
  };
  const handleDelete = (id) => {
    setIddel(id);
    setIsModalOpen(true);
    console.log(id);
  };
  const getMembershipName = (userId) => {
    const membership = memArray.find((mem) => mem.membershipid === userId);
    if (membership) {
      return membership.membershipname;
    }
    return "N/A";
  };
  const getMembershipValid = (userId) => {
    const membership = memArray.find((mem) => mem.membershipid === userId);
    if (membership) {
      return membership.membershipvalid;
    }
    return "N/A";
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-32 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col"></div>
      <div className="w-11/12 bg-slate-900 mx-auto md:p-10 p-4 py-6 pb-36 rounded-md flex flex-col gap-4 md:mt-16 md:max-h-[70vh] max-h-[90vh] overflow-y-auto">
        <h1 className="text-white text-center text-2xl md:text-4xl mb-5 font-bold">
          <span className="text-green-400">&lt;</span>Assigment
          <span className="text-green-400">/&gt;</span>
        </h1>

        <div className="text-white flex  flex-col gap-4">
          <div className="flex md:flex-row flex-col gap-3 w-full relative">
            <input
              value={form.firstname}
              onChange={handleChange}
              placeholder="Enter your Firstname"
              className="rounded-lg border-2 w-full outline-green-500 text-green-700 border-green-500 px-4 py-2 text-lg font-semibold"
              type="text"
              name="firstname"
              id="firstname"
            />
            <input
              value={form.lastname}
              onChange={handleChange}
              placeholder="Enter Your Lastname"
              className="rounded-lg border-2 w-full outline-green-500 text-green-700 border-green-500 px-4 py-2 text-lg font-semibold
                "
              type="text"
              name="lastname"
              id="lastname"
            />
          </div>
          <div className="flex md:flex-row flex-col gap-3 w-full relative">
            <input
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              className="rounded-lg border-2 w-full outline-green-500 text-green-700 border-green-500 px-4 py-2 text-lg font-semibold"
              type="email"
              name="email"
              id="email"
            />
            <input
              value={form.phonenumber}
              onChange={handleChange}
              placeholder="Enter Your Phone No."
              className="rounded-lg border-2 w-full outline-green-500 text-green-700 border-green-500 px-4 py-2 text-lg font-semibold
                "
              type="text"
              name="phonenumber"
              id="phonenumber"
            />
          </div>
          <select
            value={form.status}
            onChange={handleChange}
            className="rounded-lg border-2 w-full outline-green-500 text-green-700 border-green-500 px-4 py-2 text-lg font-semibold"
            name="status"
            id="status"
          >
            <option value="Gold">Gold</option>
            <option value="Diamond">Diamond</option>
          </select>
          <button
            onClick={saveUser}
            className="bg-green-400 p-3 text-black font-bold rounded-md flex justify-center items-center hover:bg-green-300 transition-all"
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
              className="mr-2"
            ></lord-icon>
            {editId ? "Update User" : "Add User"}
          </button>
          {passArray.length === 0 && (
            <div className="text-2xl text-center mt-3">
              No Data Available Till Now
            </div>
          )}
          {passArray.length != 0 && (
            <table className="table-auto w-full bg-green-100 mt-2 rounded-md overflow-hidden">
              <thead className="bg-green-700">
                <tr>
                  <th className="md:text-xl text-sm py-3">Full Name</th>
                  <th className="md:text-xl text-sm py-3">Email</th>
                  <th className="md:text-xl text-sm py-3">Phone Number</th>
                  <th className="md:text-xl text-sm py-3">Status</th>
                  <th className="md:text-xl text-sm py-3">Membership</th>
                  <th className="md:text-xl text-sm py-3">Mem'hip Valid</th>
                  <th className="md:text-xl text-sm py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {passArray.map((items) => (
                  <tr key={items._id}>
                    <td className="py-2 border-1 border-white w-32 text-center">
                      {items.firstname + " " + items.lastname}
                    </td>
                    <td className="py-2 border-1 w-32 text-center">
                      <div className="flex items-center justify-center gap-4">
                        {items.email}
                        <lord-icon
                          src="https://cdn.lordicon.com/jyjslctx.json"
                          trigger="hover"
                          colors="primary:#000000"
                          className="cursor-pointer"
                          onClick={() => {
                            copyText(items.email);
                          }}
                        ></lord-icon>
                      </div>
                    </td>
                    <td className="py-2 border-1 w-32 text-center">
                      <div className="flex items-center justify-center gap-4">
                        {items.phonenumber}
                      </div>
                    </td>
                    <td className="py-2 border-1 w-32 text-center">
                      <div className="flex items-center justify-center gap-4">
                        {items.status}
                      </div>
                    </td>
                    <td className="py-2 border-1 w-32 text-center">
                      <div className="flex items-center justify-center gap-4">
                        {getMembershipName(items.membershipid)}
                      </div>
                    </td>
                    <td className="py-2 border-1 w-32 text-center">
                      <div className="flex items-center justify-center gap-4">
                        {getMembershipValid(items.membershipid)}
                      </div>
                    </td>
                    <td className="py-2 border-1 w-32 text-center">
                      <div className="flex justify-center md:flex-row flex-col md:gap-0 gap-2 items-center">
                        <lord-icon
                          src="https://cdn.lordicon.com/ifsxxxte.json"
                          trigger="hover"
                          colors="primary:blue"
                          className="md:mr-3 cursor-pointer"
                          onClick={() => {
                            editHandler(items._id);
                          }}
                        ></lord-icon>
                        <lord-icon
                          src="https://cdn.lordicon.com/skkahier.json"
                          trigger="hover"
                          colors="primary:red"
                          className="cursor-pointer"
                          onClick={() => {
                            handleDelete(items._id);
                          }}
                        ></lord-icon>
                      </div>
                      <ConfirmModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={() => {
                          deleteHandler();
                        }}
                        message="Are you sure you want to delete?"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
