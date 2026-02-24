import { useState } from "react";
import axios from "axios";
import { getComments } from "../utils/fetchData.js";
import CommentEditor from "./CommentEditor.jsx";
import useCloudinary from "../hooks/useCloudinary.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button.jsx";

const CommentInput = ({ taskID, setComments }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [comment, setComment] = useState("");
  const { uploadImage } = useCloudinary();

  const handleComment = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${BACKEND_URL}/tasks/${taskID}/comments/new`,
        { description: comment },
        { withCredentials: true },
      );

      setComment("");
      getComments(BACKEND_URL, taskID, setComments);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="flex flex-col gap-2 h-auto mb-2">
      <CardHeader>
        <CardTitle className="text-left">Comment</CardTitle>
      </CardHeader>
      <CardContent>
        <CommentEditor
          value={comment}
          onChange={setComment}
          uploadImage={uploadImage}
        />
        <Button variant="secondary" className="w-full" onClick={handleComment}>
          Comment
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommentInput;
