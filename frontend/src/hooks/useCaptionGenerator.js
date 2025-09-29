import { useState } from "react";
import axios from "axios";

export function useCaptionGenerator() {
    const [captions, setCaptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generateCaption = async (file, systemPrompt, userPrompt) => {
        if (!file) return setError("Please select an image first!");
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("system_prompt", systemPrompt);
        formData.append("user_prompt", userPrompt);

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/generate-caption/`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.error) {
                setError(JSON.stringify(res.data.error));
            } else {
                setCaptions((prev) => [...prev, res.data.caption]);
                setError("");
            }
        } catch (err) {
            console.error(err);
            setError("Error generating caption");
        } finally {
            setLoading(false);
        }
    };

    return { captions, loading, error, setError, setCaptions, generateCaption };
}
