
import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../envirenment.js"


export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "https://zoom-meeting-app-cwiv.onrender.com"
})



export const AuthProvider = ({ children }) => {

    const authContext = useContext(AuthContext);

    const [userData, setUserData] = useState(authContext);

    const router = useNavigate();


     // Register middlewere
    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            })

            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }

        } catch (err) {
            throw err;
        }
    }


    // Login middlewere
    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });

            console.log(username, password)
            console.log(request.data)

            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                router("/home")
            }
        } catch (err) {
            throw err;
        }
    }
    

    // Get History Of User middlewere
    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });

            return request.data

        } catch(err) {
            throw err;
        }
    }


    // add To User History middlewere
    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });

            return request

        } catch (err) {
            throw err;
        }
    }



    const deleteHistoryItem = async (meetingId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await client.delete(`/delete_activity/${meetingId}`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === httpStatus.OK) {
                return response.data;
            }
        } catch (err) {
            console.error("Delete error:", err);
            throw err;
        }
    };

    const data = {
        userData, setUserData, addToUserHistory, getHistoryOfUser, handleRegister, handleLogin , deleteHistoryItem
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

}


