import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

type NoTokenModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function NoTokenModal({ isOpen, onOpenChange }: NoTokenModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      hideCloseButton
      classNames={{
        base: "bg-white border border-gray-200",
        header: "border-b border-gray-200",
        footer: "border-t border-gray-200",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2 text-black bg-white">
              <ShieldAlert className="h-5 w-5 text-yellow-400" />
              Sign in required
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-700">
                You need to be signed in to use AI features. Please sign in to continue.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Access personalized answers</li>
                <li>See your recent activity</li>
                <li>Sync across devices</li>
              </ul>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} className="text-gray-700 hover:bg-gray-100">
                Not now
              </Button>
              <Link href="/auth/signin" className="inline-flex">
                <Button color="primary" className="bg-yellow-500 text-black hover:bg-yellow-400">
                  Sign in
                </Button>
              </Link>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
  