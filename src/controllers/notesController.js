import { Note } from '../models/note.js';
import createHttpError from 'http-errors';
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportNotesPdf = async (req, res, next) => {
    try {
        
        const notes = await Note.find({ userId: req.user._id });

        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=notes.pdf');

        doc.pipe(res);

       const fontPath = path.join(__dirname, '../fonts/Roboto-Regular.ttf');
        doc.font(fontPath); 

        doc.fontSize(20).text('Мої нотатки', { align: 'center' });
        doc.moveDown(1.5);

        notes.forEach((note, index) => {
            doc.fontSize(14).fillColor('#2c3e50').text(`${index + 1}. ${note.title}`);
            
            const dateStr = note.createdAt ? new Date(note.createdAt).toLocaleDateString() : '';
            doc.fontSize(10).fillColor('#7f8c8d').text(`Створено: ${dateStr}`);
            
            doc.moveDown(0.3);
            doc.fontSize(12).fillColor('#34495e').text(note.content);
            doc.moveDown(1);
            
            doc.strokeColor('#bdc3c7').lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(1);
        });

        doc.end();
    } catch (error) {
        next(error);
    }
};

export const getAllNotes = async (req, res)=>{
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
      });
    }
    
    const [totalNotes, notes] = await Promise.all([
      noteQuery.clone().countDocuments(),
      noteQuery.skip(skip).limit(perPage),]);

    const totalPages = Math.ceil(totalNotes/perPage);
    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages,
      notes,
    });
};

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

export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(note);
};

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

export const updateNote = async (req, res, next) =>{
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    { new: true },
  );

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};
