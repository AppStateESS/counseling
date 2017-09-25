exports.path = require('path')
exports.APP_DIR = exports.path.resolve(__dirname, 'javascript')

exports.entry = {
  Checkin: exports.APP_DIR + '/Checkin/index.jsx',
  Clinician: exports.APP_DIR + '/Clinician/index.jsx',
  FrontDesk: exports.APP_DIR + '/FrontDesk/index.jsx',
  //Report: exports.APP_DIR + '/Report/index.jsx',
  Settings: exports.APP_DIR + '/Settings/index.jsx',
  vendor: ['react', 'react-dom']
}
