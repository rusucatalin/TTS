import { getDatabase, ref, remove } from "firebase/database";

function deletePrompt(id) {
    const db = getDatabase();
    const promptRef = ref(db, `prompts/${id}`);
    remove(promptRef)
        .then(() => {
            console.log("Prompt removed successfully.");
        })
        .catch((error) => {
            console.error("Error removing prompt:", error);
        });
}

export { deletePrompt };
