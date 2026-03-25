import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotesController = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search = '' } = req.query;

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const filter = {};

    if (tag) {
      filter.tag = tag;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (pageNumber - 1) * perPageNumber;

    const totalNotes = await Note.countDocuments(filter);

    const notes = await Note.find(filter).skip(skip).limit(perPageNumber);

    const totalPages = Math.ceil(totalNotes / perPageNumber);

    res.status(200).json({
      page: pageNumber,
      perPage: perPageNumber,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteByIdController = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNoteController = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const patchNoteController = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNoteController = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
