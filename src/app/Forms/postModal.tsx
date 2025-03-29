"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PostModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return alert("Post cannot be empty!");

    setLoading(true);

    const { error } = await supabase.from("Post").insert([{ content }]);

    if (error) {
      alert("Error creating post: " + error.message);
    } else {
      setContent(""); // Clear input after posting
      onOpenChange(); // Close modal
    }

    setLoading(false);
  };

  return (
    <>
      <Button onPress={onOpen} className="bg-indigo-600 text-white rounded-full p-3">
        + Create Post
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        classNames={{
          body: "py-6",
          base: "border border-gray-700 bg-gray-900 text-white",
        }}
      >
        <ModalContent>
          <ModalHeader>Create New Post</ModalHeader>
          <ModalBody>
            <textarea
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
              rows={4}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onOpenChange}>
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 text-white"
              onClick={handlePost}
              isDisabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
