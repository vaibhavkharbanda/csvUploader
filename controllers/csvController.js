const CSVFile = require('../models/csv');
const fs = require('fs');
const parser = require('csv-parser');

//render to the display page
module.exports.displayfiles = async (req, res) => {
  let files = await CSVFile.find({});
  return res.render('csv_display', {
    title: 'View Uploaded Files',
    files: files,
  });
};

//upload csv file action
module.exports.upload = (req, res) => {
  CSVFile.uploadedFile(req, res, (err) => {
    if (req.file) {
      CSVFile.create(req.file, function (err, csv) {
        if (err) {
          req.flash('error', 'Not uploaded!');
          return res.redirect('back');
        }
      req.flash('success', 'File successfully uploaded');

      return res.redirect('back');
      });
     } 
     else {
      req.flash('error', 'Error Unsupported File Format');
      
      return res.redirect('back');
    }
  });
};

//Upload the csv via json format
module.exports.uploadViaApi = async (req, res) => {
  try {
    CSVFile.uploadedFile(req, res, async (err) => {
      if (req.file) {
        let file = await CSVFile.create(req.file);
        return res.status(200).json({
          message: 'CSV File Upload Successful',
          data: {
            file: file,
          },
        });
      } else {
        return res.status(400).json({
          message: err,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

//action for deleting csv
module.exports.deleteFile = async (req, res) => {
  try {
    let file = await CSVFile.findById(req.params.id);
    if (file) {
      fs.unlinkSync(file.path);
      file.remove();
    }
    req.flash('success', 'File Deleted');
    return res.redirect('back');
  } catch (error) {
    return res.redirect('back');
  }
};


//display all the data in tabular format
module.exports.displayData = function (req, res) {
  CSVFile.findById(req.params.id, function (err, file) {
    let path = file.path;
    let results = [];
    fs.createReadStream(path)
      .pipe(parser({ delimiter: ',' }))
      .on('data', (data) => results.push(data))
      .on('error', function (err) {
        console.error(err.message);
      })
      .on('end', () => {
        return res.render('csv_data', {
          title: 'File Data',
          data: results,
        });
      });
  });
};