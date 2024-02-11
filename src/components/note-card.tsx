"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	useDisclosure,
} from "@nextui-org/react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface NoteCardProps {
	note: {
		id: string;
		date: Date;
		content: string;
	};
	onNoteDeleted: (id: string) => void;
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const controls = useAnimation();

	useEffect(() => {
		controls.start({ opacity: 1, y: 0 });
	}, [controls]);

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={controls}
				transition={{ duration: 0.5 }}
			>
				<Button
					type="button"
					onPress={onOpen}
					className="h-full w-full text-justify flex flex-col items-start justify-start rounded-md bg-slate-800 p-5 gap-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 text-wrap"
				>
					<span className="text-sm font-medium text-slate-300">
						{formatDistanceToNow(note.date, {
							locale: ptBR,
							addSuffix: true,
						})}
					</span>
					<p className="text-sm leading-6 text-slate-400">{note.content}</p>
					<div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
				</Button>

				<Modal
					backdrop="blur"
					isOpen={isOpen}
					onClose={onClose}
					onOpenChange={onOpenChange}
					className="max-w-[640px] w-full rounded-md h-[60vh]"
					classNames={{
						base: "bg-slate-700",
						body: "overflow-hidden",
						footer: "p-0",
						closeButton:
							"bg-slate-800 right-0 top-0 absolute active:bg-slate-800 p-1.5 text-slate-400 hover:text-slate-400 hover:bg-slate-800 rounded-none",
					}}
				>
					<ModalContent>
						{(onClose) => {
							return (
								<>
									<ModalBody>
										<div className="flex flex-1 flex-col gap-3 p-5 text-justify">
											<span className="text-sm font-medium text-slate-300">
												{formatDistanceToNow(note.date, {
													locale: ptBR,
													addSuffix: true,
												})}
											</span>

											<p className="text-sm leading-6 text-slate-400">
												{note.content}
											</p>
										</div>
									</ModalBody>

									<ModalFooter>
										<Button
											type="button"
											onPress={onClose}
											onClick={() => onNoteDeleted(note.id)}
											fullWidth
											className="bg-slate-800 py-4 text-sm text-slate-300 outline-none rounded-none font-medium group data-[pressed=true]:scale-[1]"
										>
											<p>
												Deseja{" "}
												<span className="text-red-400 hover:underline group-hover:underline">
													apagar esta nota
												</span>
												?
											</p>
										</Button>
									</ModalFooter>
								</>
							);
						}}
					</ModalContent>
				</Modal>
			</motion.div>
		</>
	);
}
