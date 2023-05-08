import Router  from 'express-promise-router';
import { getCSVData } from "../controllers/csv.controller.js"
import multer from 'multer';
import os from 'os';
const router = Router();

const upload = multer({ dest: os.tmpdir() });

router.post('/getcsvdata', upload.single('CSV'), function(req, res) {
    
    const file = req.file;
    const isSelfRepeated = false;
    getCSVData(file, isSelfRepeated,res);
    
  });

router.use((err, req, res, next) => {
    res.status(403).send(err.message);
});
export default router;