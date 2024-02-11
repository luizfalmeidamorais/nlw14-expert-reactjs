"use client";

import { NewNoteCard } from "@/components/new-note-card";
import { NoteCard } from "@/components/note-card";
import { useAnimation, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Note {
	id: string;
	date: Date;
	content: string;
}

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [notes, setNotes] = useState<Note[]>([]);
	const controls = useAnimation();

	useEffect(() => {
		const notesOnStorage = localStorage.getItem("notes");
		if (notesOnStorage) setNotes(JSON.parse(notesOnStorage));

		setTimeout(() => {
			setLoading(false);
			controls.start({ opacity: 0, transition: { duration: 1 } });
		}, 2000);
	}, [controls]);

	function onNoteCreated(content: string) {
		const newNote = {
			id: crypto.randomUUID(),
			date: new Date(),
			content,
		};

		const notesArray = [newNote, ...notes];
		setNotes(notesArray);

		localStorage.setItem("notes", JSON.stringify(notesArray));
	}

	function onNoteDeleted(id: string) {
		const notesArray = notes.filter((note) => {
			return note.id !== id;
		});

		setNotes(notesArray);
		localStorage.setItem("notes", JSON.stringify(notesArray));
	}

	function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
		event.preventDefault();

		const query = event.target.value;
		setSearch(query);
	}

	const filteredNotes =
		search !== ""
			? notes.filter((note) =>
					note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
			  )
			: notes;

	return (
		<>
			<div
				className={`mx-auto max-w-6xl py-12 space-y-6 px-5 ${
					loading ? "opacity-[0.5]" : "opacity-[1]"
				}`}
			>
				<img src="/logo.png" alt="NLW Expert" />

				<form className="w-full" onSubmit={(event) => event.preventDefault()}>
					<input
						type="text"
						placeholder="Busque em suas notas..."
						className="w-full bg-transparent text-3xl outline-none font-semibold tracking-tight placeholder:text-slate-500"
						onChange={handleSearch}
					/>
				</form>

				<div className="h-px bg-slate-700" />

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
					<NewNoteCard onNoteCreated={onNoteCreated} />

					{filteredNotes.map((note) => {
						return (
							<NoteCard
								note={note}
								key={note.id}
								onNoteDeleted={onNoteDeleted}
							/>
						);
					})}
				</div>
			</div>

			{loading && (
				<motion.div
					className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
					animate={controls}
				>
					<motion.img
						src="logo2.png"
						alt="Logo do Projeto"
						initial={{ scale: 0 }}
						animate={{ scale: 1, rotate: 360 }}
						transition={{ duration: 1, repeat: 1, repeatType: "reverse" }}
					/>
				</motion.div>
			)}
		</>
	);
}
