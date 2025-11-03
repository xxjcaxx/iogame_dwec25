export { renderProfile };

import { getData, getImage, getSession, updateData, updateProfile } from "../services/supaservice";


const renderProfile = () => {
  let id = null;

  const formHTML = `
    <h1>Profile</h1>
            <form>
            <img id="previAvatar" style="width:200px">
              <div class="mb-3">
                    <label for="avatar" class="form-label">Avatar</label>
                    <input type="file" name="avatar" class="form-control" id="avatar">
                </div>
                <div class="mb-3">
                    <label for="username" class="form-label">User Name</label>
                    <input type="text" name="username" class="form-control" id="username" aria-describedby="emailHelp">
                 </div>
                <div class="mb-3">
                    <label for="full_name" class="form-label">Full Name</label>
                    <input type="text" name="full_name" class="form-control" id="full_name">
                </div>
                 <div class="mb-3">
                    <label for="avatar_url" class="form-label">Avatar URL</label>
                    <input type="text" name="avatar_url" class="form-control" id="avatar_url">
                </div>
                 <div class="mb-3">
                    <label for="website" class="form-label">Website</label>
                    <input type="text" name="website" class="form-control" id="website">
                </div>
                

                <button id="submit-login" type="submit" class="btn btn-primary">Submit</button>
        </form>
    `;
  const divProfile = document.createElement("div");
  divProfile.classList.add("container", "w-25", "vh-100");
  divProfile.innerHTML = formHTML;

  const previAvatar = divProfile.querySelector('#previAvatar');
  const inputAvatar = divProfile.querySelector('#avatar');
  inputAvatar.addEventListener('change', () => {
    const file = inputAvatar.files[0];
    const fileURL = URL.createObjectURL(file);
    previAvatar.src = fileURL;
  });


  const form = divProfile.querySelector("form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const dataProfile = Object.fromEntries(formData);
    if (id) {
      const result = await updateProfile(id, dataProfile);
      console.log(result);
    }

    form.reset();
  });

  const refreshData = async () => {
    const user_id = getSession()
    const profileData = await getData("profiles",{id: user_id});

    divProfile.querySelector("#username").value = profileData[0].username;
    divProfile.querySelector("#full_name").value = profileData[0].full_name;
    divProfile.querySelector("#avatar_url").value = profileData[0].avatar_url;
    divProfile.querySelector("#website").value = profileData[0].website;

    divProfile.querySelector("#previAvatar").src = await getImage(profileData[0].avatar_url);
    id = profileData[0].id;

  };

  refreshData();

  return divProfile;
};
