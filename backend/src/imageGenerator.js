const { createCanvas } = require('canvas');
const polyline = require('@mapbox/polyline');

function randomColor(){
  const hues = ['#FF4500'];
  return hues[Math.floor(Math.random() * hues.length)];
}

function normalizePoints(points, width, height) {
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = Math.min(width/(maxX-minX), height/(maxY-minY));
  return points.map(p => [
    (p[0]-minX)*scale,
    (p[1]-minY)*scale
  ]);
}

async function generateYearImage(activities, { width, height }) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // background
  ctx.fillStyle = '#edeef1ff';
  ctx.fillRect(0, 0, width, height);

  // --- Draw routes ---
  ctx.globalAlpha = 0.4;
  for (const act of activities) {
    if (!act.summary_polyline) continue;
    try {
      const coords = polyline.decode(act.summary_polyline);
      const points = normalizePoints(coords, 150, 150);
      const offsetX = Math.random() * (width - 150);
      const offsetY = Math.random() * (height - 150);
      const angle = (Math.random() - 0.5) * 2 * Math.PI;

      ctx.save();
      ctx.translate(offsetX + 75, offsetY + 75);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.strokeStyle = randomColor();
      ctx.lineWidth = 2;
      for (let i = 0; i < points.length; i++) {
        const [x, y] = points[i];
        if (i === 0) ctx.moveTo(x - 75, y - 75);
        else ctx.lineTo(x - 75, y - 75);
      }
      ctx.stroke();
      ctx.restore();
    } catch (e) {
      console.log('Polyline error:', e.message);
    }
  }
  ctx.globalAlpha = 1;

  // --- Add summary text ---
  const totalDistance = (activities.reduce((a,b)=>a+(b.distance||0),0)/1000).toFixed(1);
  const totalRuns = activities.length;
  const totalTime = activities.reduce((a,b)=>a+(b.moving_time||0),0);
  const hours = Math.floor(totalTime/3600);
  const mins = Math.floor((totalTime%3600)/60);

  ctx.fillStyle = 'black';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(`STRAVA 2025 — Year in Runs`, 60, height-180);
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(`Runs: ${totalRuns}`, 60, height-130);
  ctx.fillText(`Distance: ${totalDistance} km`, 60, height-95);
  ctx.fillText(`Moving time: ${hours}h ${mins}m`, 60, height-60);
  ctx.font = '14px sans-serif';
  ctx.fillText('Generated with your Strava activities', 60, height-25);

  return canvas.toBuffer('image/png');
}

module.exports = { generateYearImage };
