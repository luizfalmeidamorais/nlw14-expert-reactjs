"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface NewNoteCardProps {
	onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
	const [isRecording, setIsRecording] = useState(false);
	const [content, setContent] = useState("");

	function handleStartEditor() {
		setShouldShowOnboarding(false);
	}

	function handleContentChanged(event: React.ChangeEvent<HTMLTextAreaElement>) {
		setContent(event.target.value);

		if (event.target.value === "") {
			setShouldShowOnboarding(true);
		}
	}

	function handleSaveNote(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();

		if (content === "") {
			toast.error("A nota não pode estar vazia!");
			return;
		}

		onNoteCreated(content);
		setContent("");
		setShouldShowOnboarding(true);

		toast.success("Nota salva com sucesso!");
	}

	function handleStartRecording() {
		const isSpeechRecognitionAPIAvailable =
			"SpeechRecognition" in window || "webkitSpeechRecognition" in window;

		if (!isSpeechRecognitionAPIAvailable) {
			toast.error("Seu navegador não suporta a gravação de áudio.");
			return;
		}

		setIsRecording(true);
		setShouldShowOnboarding(false);

		const SpeechRecognitionAPI =
			window.SpeechRecognition || window.webkitSpeechRecognition;

		speechRecognition = new SpeechRecognitionAPI();

		speechRecognition.lang = "pt-BR";
		speechRecognition.continuous = true;
		speechRecognition.maxAlternatives = 1;
		speechRecognition.interimResults = true;

		speechRecognition.onresult = (event) => {
			const transcription = Array.from(event.results).reduce((text, result) => {
				return text.concat(result[0].transcript);
			}, "");
			setContent(transcription);
		};

		speechRecognition.onerror = (event) => {
			console.error(event.error);
		};

		speechRecognition.start();
	}

	function handleStopRecording() {
		setIsRecording(false);

		if (speechRecognition !== null) speechRecognition.stop();
	}

	return (
		<>
			<Button
				className="rounded-md bg-slate-700 p-5 gap-3 flex flex-col h-auto text-wrap text-justify justify-start items-start hover:ring-2 hover:ring-slate-600"
				type="button"
				onPress={onOpen}
			>
				<span className="text-sm font-medium text-slate-200">
					Adicionar Nota
				</span>
				<p className="text-sm leading-6 text-slate-400">
					Grave uma nota em áudio que será convertida para texto
					automaticamente.
				</p>
			</Button>

			<Modal
				backdrop="blur"
				isOpen={isOpen}
				onClose={() => {
					if (isRecording) handleStopRecording();

					onClose();
					setShouldShowOnboarding(true);
					setContent("");
				}}
				onOpenChange={onOpenChange}
				className="max-w-[640px] w-full rounded-md h-[60vh] overflow-hidden"
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
								<form
									className="flex-1 flex flex-col"
									onSubmit={(event) => event.preventDefault()}
								>
									<ModalBody>
										<div className="flex flex-1 flex-col gap-3 p-5">
											<span className="text-sm font-medium text-slate-300">
												Adicionar nota
											</span>

											{shouldShowOnboarding ? (
												<p className="text-sm leading-6 text-slate-400">
													Comece{" "}
													<button
														type="button"
														className="font-medium text-lime-400 hover:underline"
														onClick={handleStartRecording}
													>
														gravando uma nota
													</button>{" "}
													em áudio ou se preferir{" "}
													<button
														type="button"
														className="font-medium text-lime-400 hover:underline"
														onClick={handleStartEditor}
													>
														utilize apenas texto
													</button>
													.
												</p>
											) : (
												<textarea
													className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
													value={content}
													onChange={handleContentChanged}
													// biome-ignore lint/a11y/noAutofocus: <explanation>
													autoFocus
												/>
											)}
										</div>
									</ModalBody>

									<ModalFooter>
										{isRecording ? (
											<Button
												type="button"
												fullWidth
												onClick={handleStopRecording}
												className="bg-slate-900 py-4 text-sm text-slate-300 outline-none rounded-none font-medium hover:text-slate-100 data-[pressed=true]:scale-[1]"
											>
												<div className="size-3 rounded-full bg-red-500 animate-pulse" />
												<p>Gravando! (clique para interromper)</p>
											</Button>
										) : (
											<Button
												type="button"
												fullWidth
												onPress={onClose}
												onClick={handleSaveNote}
												className="bg-lime-400 py-4 text-sm text-lime-950 outline-none rounded-none font-medium hover:bg-lime-500 data-[pressed=true]:scale-[1]"
											>
												<p>Salvar Nota</p>
											</Button>
										)}
									</ModalFooter>
								</form>
							</>
						);
					}}
				</ModalContent>
			</Modal>
		</>
	);
}
