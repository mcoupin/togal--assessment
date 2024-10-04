const getDocuments = async (folderId) => {
  const response = await fetch(`http://localhost:3000/documents/${folderId}`);
  if (response.status === 204) return [];
  return await response.json();
};

export default getDocuments;
