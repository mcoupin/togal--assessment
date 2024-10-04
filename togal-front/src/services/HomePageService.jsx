const getFolders = async () => {
  const response = await fetch("http://localhost:3000/folders");
  return await response.json();
};

export default getFolders;
