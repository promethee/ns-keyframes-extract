const { config } = require('../package.json');
const fs = require('fs');
const { send } = require('micro');
const extractKeyframes = require('extract-keyframes');

const { files_directory = './files' } = config;

module.exports.GET = async (req, res) => {
  const { query = {} } = req;
  const { filepath = '' } = query;
  if (filepath.length === 0) return send(res, 400, 'no filepath provided');
  console.info(`using "${filepath}"`);

  const video_filename = filepath.split('/').filter((chunk) => chunk.includes('.'))[0];
  const clean_filepath = filepath.replace(video_filename, '');

  const full_filepath = `${files_directory}/${clean_filepath}`;
  if (!fs.existsSync(full_filepath)) return send(res, 404, 'file not found');
  console.info(`"${full_filepath}" found`);
  
  const frames_directory = `${full_filepath}frames`;
  if (!fs.existsSync(frames_directory)) fs.mkdirSync(frames_directory);
  console.info(`"${frames_directory}" existing or created`);
  let frameCount = 0;

  const extractionProcess = await extractKeyframes(`${full_filepath}/${video_filename}`);

  extractionProcess.on('start', () => {
    console.debug('Started');
  }, false);

  extractionProcess.on('finish', (data) => {
    console.debug('Finish:', data);
    send(res, 200, { frameCount, path: frames_directory });
  });

  extractionProcess.on('keyframe', ({ keyframeTimeoffset, image }) => {
    const frame_filepath = `${frames_directory}/frame-${frameCount}_offset-${keyframeTimeoffset}_.jpg`;
    console.debug('KEYFRAME:', { frameCount, keyframeTimeoffset, frame_filepath });
    fs.writeFileSync(frame_filepath, image);
    frameCount++;
  });
};
