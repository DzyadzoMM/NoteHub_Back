import { Note } from '../models/note.js';
import createHttpError from 'http-errors';


//Отримання всіх нотаток
export const getAllNotes = async (req, res)=>{
    //const {page = 1, perPage = 15, tag} = req.query
    const page = parseInt(req.query.page||1);
    const perPage = parseInt(req.query.perPage||15);
    const tag = req.query.tag;
    const search = req.query.search;
    const skip = (page -1)*perPage;

    const noteQuery = Note.find({userId: req.user._id});

    if (tag){
      noteQuery.where("tag").equals(tag);
    }

    if (search){
      noteQuery.where({
        $text:{$search: search}
      })
    }
    
    const [totalNotes, notes] = await Promise.all([
      noteQuery.clone().countDocuments(),
      noteQuery.skip(skip).limit(perPage),])

    const totalPages = Math.ceil(totalNotes/perPage);
    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages,
      notes,
    });
};

//Отримання однієї нотатки
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOne({
    _id:noteId,
    userId: req.user._id,
  });
  
  if(!note){
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};

// Створення нотатки
export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(note);
};

//Видалення нотатки
export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    next(createHttpError(404, "Note not found"));
    return;
  }
  res.status(200).send(note);
};

//Оновлення даних нотатки
export const updateNote = async (req, res, next) =>{
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id }, // Шукаємо по id та по id користувача
    req.body,
    { new: true }, // повертаємо оновлений документ
  );

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};
