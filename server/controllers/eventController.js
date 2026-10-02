const { Event, Album } = require('../models');
const { toDataUri } = require('../middleware/upload');

// Images live in the DB as base64 data URIs (the host wipes local uploads on redeploy).
// API responses expose a lightweight URL instead of inlining the blob.
const serialize = (e) => {
  const j = e.toJSON();
  const v = new Date(j.updatedAt).getTime();
  const out = { ...j, imageUrl: j.image ? `/api/events/${j.id}/image?v=${v}` : null, bannerUrl: j.banner ? `/api/events/${j.id}/banner?v=${v}` : null };
  delete out.image; delete out.banner;
  return out;
};

const ORDER = [['displayOrder', 'ASC'], ['eventDate', 'ASC'], ['id', 'ASC']];

// ----- public -----
const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ where: { isActive: true }, order: ORDER });
    res.json(events.map(serialize));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const sendImage = (field) => async (req, res) => {
  try {
    const e = await Event.findByPk(req.params.id, { attributes: ['id', 'isActive', field] });
    // Inactive events must not leak their images either
    if (!e || !e.isActive || !e[field]) return res.status(404).end();
    const m = /^data:([^;]+);base64,(.*)$/s.exec(e[field]);
    if (!m) return res.status(404).end();
    res.set('Content-Type', m[1]);
    res.set('Cache-Control', 'public, max-age=31536000, immutable'); // URL carries ?v=updatedAt
    res.send(Buffer.from(m[2], 'base64'));
  } catch (err) { res.status(500).end(); }
};

// ----- admin -----
const adminList = async (req, res) => {
  try { res.json((await Event.findAll({ order: ORDER })).map(serialize)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

const bool = (v, d) => (v === undefined ? d : v === true || v === 'true' || v === '1' || v === 1);

const adminCreate = async (req, res) => {
  try {
    const { title, description, eventDate, location, isActive } = req.body;
    if (!String(title || '').trim()) return res.status(400).json({ message: 'Event title is required' });
    if (!eventDate) return res.status(400).json({ message: 'Event date is required' });
    const max = await Event.max('displayOrder');
    const ev = await Event.create({
      title: title.trim(), description: description || null, eventDate, location: (location || '').trim() || null,
      isActive: bool(isActive, true), displayOrder: (max || 0) + 1,
      image:  req.files?.image?.[0]  ? toDataUri(req.files.image[0])  : null,
      banner: req.files?.banner?.[0] ? toDataUri(req.files.banner[0]) : null,
    });
    res.status(201).json(serialize(ev));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const adminUpdate = async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    const { title, description, eventDate, location, isActive, removeImage, removeBanner } = req.body;
    const u = {};
    if (title !== undefined) {
      if (!String(title).trim()) return res.status(400).json({ message: 'Event title is required' });
      u.title = title.trim();
    }
    if (description !== undefined) u.description = description || null;
    if (eventDate !== undefined && eventDate !== '') u.eventDate = eventDate;
    if (location !== undefined) u.location = String(location).trim() || null;
    if (isActive !== undefined) u.isActive = bool(isActive, true);
    if (req.files?.image?.[0])  u.image  = toDataUri(req.files.image[0]);
    else if (bool(removeImage, false)) u.image = null;
    if (req.files?.banner?.[0]) u.banner = toDataUri(req.files.banner[0]);
    else if (bool(removeBanner, false)) u.banner = null;
    await ev.update(u);
    res.json(serialize(ev));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const adminDelete = async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    await Album.update({ eventId: null }, { where: { eventId: ev.id } }); // keep albums, just unlink
    await ev.destroy();
    res.json({ message: 'Event deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const adminReorder = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ message: 'ids array required' });
    await Promise.all(ids.map((id, i) => Event.update({ displayOrder: i + 1 }, { where: { id } })));
    res.json({ message: 'Order saved' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {
  getEvents, getEventImage: sendImage('image'), getEventBanner: sendImage('banner'),
  adminList, adminCreate, adminUpdate, adminDelete, adminReorder,
};
