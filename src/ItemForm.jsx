import { useEffect, useState } from "react";
import axios from '../src/config/axios';
import "./components/ItemForm.css";

function ItemForm() {
    const [form, setForm] = useState({
        name: "",
        item_type_id: "",
        purchase_date: "",
        stock_available: false
    });
    const [items, setItems] = useState([]);
    const [types, setTypes] = useState([]);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchTypes();
        fetchItems();
    }, []);

    const fetchTypes = async () => {

        try {

            const response = await axios.get(
                "/api/item-types"
            );
            setTypes(response.data);

        } catch(err) {

            console.log(err);
        }
    };

    /* FETCH ITEMS */
    const fetchItems = async () => {

        try {

            const response = await axios.get(
                "/api/items"
            );

            setItems(response.data);

        } catch(err) {

            console.log(err);
        }
    };

    /* HANDLE CHANGE */
    const handleChange = (e) => {

        const { name, value, checked, type } = e.target;

        setForm({
            ...form,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        });
    };

    /* HANDLE SUBMIT */
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if(editId) {

                await axios.put(
                    `/api/items/${editId}`,
                    form
                );

                alert("Item updated successfully");

            } else {

                await axios.post(
                    "/api/items",
                    form
                );

                alert("Item added successfully");
            }

            setForm({
                name: "",
                item_type_id: "",
                purchase_date: "",
                stock_available: false
            });

            setEditId(null);

            fetchItems();

        } catch(err) {

            console.log(err);

            alert(
                err.response?.data?.error?.[0]?.message ||
                "Something went wrong"
            );
        }
    };

    /* HANDLE EDIT */
    const handleEdit = (item) => {

        setEditId(item.id);

        setForm({
            name: item.name,
            item_type_id: item.item_type_id,
            purchase_date: item.purchase_date?.split("T")[0],
            stock_available: item.stock_available
        });
    };

    /* HANDLE DELETE */
    const handleDelete = async (id) => {

        try {

            await axios.delete(
                `/api/items/${id}`
            );

            alert("Item deleted successfully");

            fetchItems();

        } catch(err) {

            console.log(err);
        }
    };

    return (
        <div className="container">

            <h1>Inventory Management System</h1>

            <form onSubmit={handleSubmit} className="form">

                {/* ITEM NAME */}
                <input
                    type="text"
                    placeholder="Enter Item Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                />

                {/* ITEM TYPE */}
                <select
                    name="item_type_id"
                    value={form.item_type_id}
                    onChange={handleChange}
                >
                    <option value="">
                        Select Item Type
                    </option>

                    {types.map((type) => (
                        <option
                            key={type.id}
                            value={type.id}
                        >
                            {type.type_name}
                        </option>
                    ))}

                </select>

                {/* PURCHASE DATE */}
                <input
                    type="date"
                    name="purchase_date"
                    value={form.purchase_date}
                    onChange={handleChange}
                />

                {/* STOCK AVAILABLE */}
                <label>

                    <input
                        type="checkbox"
                        name="stock_available"
                        checked={form.stock_available}
                        onChange={handleChange}
                    />

                    Stock Available

                </label>

                <button type="submit">

                    {editId
                        ? "Update Item"
                        : "Add Item"}

                </button>

            </form>

            {/* TABLE */}

            <table>

                <thead>

                    <tr>
                        <th>Item Name</th>
                        <th>Item Type</th>
                        <th>Purchase Date</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

                    {items.map((item) => (

                        <tr key={item.id}>

                            <td>{item.name}</td>

                            <td>{item.type_name}</td>

                            <td>
                                {item.purchase_date?.split("T")[0]}
                            </td>

                            <td>
                                {item.stock_available
                                    ? "Available"
                                    : "Not Available"}
                            </td>

                            <td>

                                <button
                                    onClick={() => handleEdit(item)}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default ItemForm;

