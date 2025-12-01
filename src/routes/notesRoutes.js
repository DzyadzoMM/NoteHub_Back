import { Router } from 'express';
import { celebrate } from 'celebrate';
import {getAllNotes, getNoteById, createNote, deleteNote, updateNote} from '../controllers/notesController.js';
import { createNoteSchema, noteIdSchema, updateNoteSchema, getAllNotesSchema } from '../validations/notesValidation.js';
import {authenticate} from '../middleware/authenticate.js';


const router = Router();

router.use('/notes', authenticate);

// Отримання всіх нотаток
router.get('/notes',celebrate(getAllNotesSchema), getAllNotes);

//Отримання однієї нотатки
router.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

// Створення нотатки
router.post('/notes', celebrate(createNoteSchema), createNote);

//Видалення нотатки
router.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

//Оновлення нотатки
router.patch('/notes/:noteId',celebrate(updateNoteSchema), updateNote)

export default router;