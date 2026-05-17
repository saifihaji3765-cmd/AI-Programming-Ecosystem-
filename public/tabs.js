/* =========================
   TABS STATE
========================= */

let openTabs = [];

let activeTab = null;

/* =========================
   OPEN FILE TAB
========================= */

function openFileTab(file){

  const exists =
    openTabs.find(

      tab =>
      tab.name === file.name

    );

  if(!exists){

    openTabs.push(file);

  }

  activeTab =
    file.name;

  renderTabs();

}

/* =========================
   RENDER TABS
========================= */

function renderTabs(){

  const activeFile =
    openTabs.find(

      tab =>
      tab.name === activeTab

    );

  if(!activeFile) return;

  let tabsHTML = "";

  openTabs.forEach(tab => {

    tabsHTML += `

      <div

        class="
          tab
          ${
            tab.name === activeTab
            ? "active"
            : ""
          }
        "

        onclick="
          switchTab(
            '${tab.name}'
          )
        "

      >

        📄 ${tab.name}

        <span

          style="
            margin-left:10px;
            color:#94a3b8;
            cursor:pointer;
          "

          onclick="
            closeTab(
              event,
              '${tab.name}'
            )
          "

        >
          ✕
        </span>

      </div>

    `;

  });

  const html = `

    <div class="tabs-bar">

      ${tabsHTML}

    </div>

    <div
      id="editorMount"
      class="editor-container"
    ></div>

  `;

  const chat =
    document.getElementById(
      "chat"
    );

  chat.innerHTML = html;

  initializeEditor(
    activeFile
  );

}

/* =========================
   SWITCH TAB
========================= */

function switchTab(name){

  activeTab = name;

  renderTabs();

}

/* =========================
   CLOSE TAB
========================= */

function closeTab(
  event,
  name
){

  event.stopPropagation();

  openTabs =
    openTabs.filter(

      tab =>
      tab.name !== name

    );

  if(activeTab === name){

    if(openTabs.length > 0){

      activeTab =
        openTabs[
          openTabs.length - 1
        ].name;

    } else {

      activeTab = null;

      document.getElementById(
        "chat"
      ).innerHTML = `

        <div class="welcome">

          <h1>
            Build Anything with AI
          </h1>

          <p>
            Open a file to start editing.
          </p>

        </div>

      `;

      return;

    }

  }

  renderTabs();

}
