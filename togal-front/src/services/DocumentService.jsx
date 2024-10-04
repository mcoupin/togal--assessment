const postDocument = async ({ title, description, folderId }) => {
  const response = await fetch("http://localhost:3000/documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description,
      folder: folderId,
    }),
  });
  return await response.json();
};

export { postDocument };
