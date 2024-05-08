import { getDatabase, ref, onValue, push, remove } from "firebase/database";

function deletePrompt(id) {
    const db = getDatabase();
    const promptRef = ref(db, `prompts/${id}`);
    remove(promptRef);
}

export { deletePrompt };
