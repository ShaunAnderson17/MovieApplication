import React, { useState } from "react";
 
export default function AdvancedSearch() {   
    const [action, setAction] = useState<boolean>(false);
    const [comedy, setComedy] = useState<boolean>(false);

    const HandleAction = (data: string) => {   
        if (data === "Action" && action) {
            console.log(data, "Unchecked");
        }
        else if (data === "Action" && !action) {
            console.log("Action Genre");
        } 
        setAction(!action); 
    };

    const HandleComedy = (data: string) => {
        if (data === "Comdey" && comedy) {
            console.log(data, "Unchecked");
        }
        else if (data === "Comedy" && !comedy) {
            console.log("Comedy Genre");
        }
        setAction(!comedy);
    }

    return (
        <h1>
            Genre
            <div className="Advanced-Search">
                <input type="checkbox" value="Action" checked={action} onChange={() => HandleAction("Action")} /> Action
                <input type="checkbox" value="Comedy" checked={comedy} onChange={() => HandleComedy("Comedy")} /> Comedy 
            </div>
        </h1>
    );
}