# Chat App Redesign

Let's begin our first experiment: A Chat App Redesign where we will create a wireframe and redesign the user interface of a well-known chat application. We will be using Figma as our design tool throughout this tutorial, as recommended by the university.

For our experiment, we'll focus on <span class="WhatsApp">WhatsApp</span>, a widely-used messaging platform from Meta. WhatsApp exemplifies excellent user interface design through its intuitive navigation, clear visual hierarchy, and consistent design patterns. The app successfully balances functionality with simplicity, making it accessible to users across different age groups and technical backgrounds. Its interface prioritizes the most frequently used features while maintaining a clean, uncluttered appearance.

![WhatsApp interface on Apple iOS and Android](images/chat-app-redesign/whatsapp-user-interface.png)
*New iOS and Android user interface on WhatsApp. Image courtesy of Meta Design, 2024.*

Lets start with creating home screen interface of WhatsApp

---
## 1. Get familiar with tools in Figma

![Description about tools in figma](images/chat-app-redesign/tools.jpg)
For more details about other tools, visit [Figma's toolbar help page.](https://help.figma.com/hc/en-us/articles/360041064174-Access-design-tools-from-the-toolbar)

---
## 2. Wireframing

### What is a Wireframe?

A **wireframe** is a basic visual guide that represents the structure and layout of a digital interface. It serves as a blueprint for a design, focusing on the arrangement of elements without detailed styling or functionality. Wireframes help designers plan the user experience (UX) by defining the placement of key components such as navigation bars, buttons, and content sections before adding colors, images, or animations.
### ▶ Creating a Frame

To create a frame:

1. Press **F** or select **Frame** from the toolbar.
2. Choose a predefined device size from the sidebar or set custom dimensions.
3. For this tutorial, we'll use the **Android Compact** frame.

![Creating a Frame](images/chat-app-redesign/wireframe-1.png)

Since this is a wireframe, we won't add details to the status bar.
### ▶ Adding the Status Bar

1. Select the **Rectangle Tool** from the toolbar and place it on the canvas.
2. Set the **width (W) to 412** and **height (H) to 50**, then align it to the top.

![Adding the Status Bar](images/chat-app-redesign/wireframe-2.png)
### ▶ Adding the WhatsApp Branding

1. Use the **Text Tool (T)** to add the text **"WhatsApp"** in the branding area.
2. Set the font to **bold**, size **24**, and position it at **x = 20, y = 70**.

![Adding the WhatsApp Branding](images/chat-app-redesign/wireframe-3.png)
### ▶ Adding Icons

1. Create **two squares (40 x 40)** for the **Camera** and **Menu** icons.
2. Enable the **"Maintain Aspect Ratio"** option before resizing.
3. Adjust the **corner radius** for a rounded effect.
4. Use **Ctrl + D** to duplicate and position the icons.

![Adding Icons](images/chat-app-redesign/wireframe-4.png)
### ▶ Creating the Search Bar

1. Create a **new frame (350 x 50)** and center it horizontally.
2. Add a **rectangle (same size as the frame)** and set the **corner radius to 50** for rounded edges.

![Creating the Search Bar](images/chat-app-redesign/wireframe-5.png)

3. Add a **circle (22 x 22)** for the **Meta AI icon** inside the search bar.
4. Change its color for contrast.

![Creating the Meta AI icon](images/chat-app-redesign/wireframe-6.png)

5. Add the text **"Ask Meta AI or Search"** (font size **18**, regular) inside the search bar.

![Add placeholder to search bar](images/chat-app-redesign/wireframe-7.png)
### ▶ Adding Filter Buttons

1. Create a **frame (350 x 60)** below the search bar.
2. Add **three buttons** using rectangles:
    - **"All"** (50 x 30)
    - **"Unread"** (80 x 30)
    - **"Groups"** (80 x 30)
3. Set a **corner radius of 50** for rounded buttons.

![Adding Filter Buttons](images/chat-app-redesign/wireframe-8.png)

4. Add text (**size 16, regular**) for each button and center it within its respective rectangle.

![Adding Filter Buttons Labels](images/chat-app-redesign/wireframe-9.png)
### ▶ Creating the Navigation Bar

1. Create a **frame (412 x 100)** for the bottom navigation bar.
2. Add **four squares (30 x 30)** for the icons representing:
    - **Chats** (x = 49)
    - **Updates** (x = 144)
    - **Communities** (x = 239)
    - **Calls** (x = 334)

![Creating the Navigation Bar](images/chat-app-redesign/wireframe-10.png)

3. Add corresponding text labels (**size 12, regular**) below each icon.

![Add Navigation Bar Labels](images/chat-app-redesign/wireframe-11.png)
### ▶ Creating the Chat List

1. Create a **frame (412 x 582)** to contain all chats.
2. Create a **sub-container (412 x 80)** for an individual chat.
3. Add a **circle (50 x 50)** for the contact icon.

![Creating the Chat List](images/chat-app-redesign/wireframe-12.png)

4. Add text elements for:
	- **Contact name** (size **20**, semi-bold)
	- **Last message** (size **16**, regular)
	- **Time** (size **14**, regular)

![Add Chat List Text Elements](images/chat-app-redesign/wireframe-13.png)

5. Duplicate this sub-container to create multiple chat entries.

![Duplicate Chat List](images/chat-app-redesign/wireframe-14.png)
### ▶ Final Wireframe

With these steps completed, we now have a fully structured wireframe for the app, providing a basic layout of the interface.

![Final Wireframe](images/chat-app-redesign/wireframe.png)