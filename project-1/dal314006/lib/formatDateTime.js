// The model's strings carry no offset, so Date reads them as local time.
export default function formatDateTime(isoLocal) {
  const when = new Date(isoLocal);

  if (Number.isNaN(when.getTime())) {
    return isoLocal;
  }

  return when.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}
