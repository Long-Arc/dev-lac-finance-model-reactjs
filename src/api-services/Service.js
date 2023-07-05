const baseUrl = "https://dev-api-lacfinance.azurewebsites.net";
// const baseUrl = "http://localhost:5000";

export async function get(url) {
  try {
    const response = await fetch(baseUrl + url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("secretToken")}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function searchById(url, id) {
  try {
    const response = await fetch(baseUrl + url + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("secretToken")}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function create(url, data) {
  try {
    const response = await fetch(baseUrl + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("secretToken")}`,
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function update(url, data, id) {
  try {
    const response = await fetch(baseUrl + url.replace('email', id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("secretToken")}`,
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function remove(url, id) {
  try {
    const response = await fetch(baseUrl + url + "/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("secretToken")}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}
