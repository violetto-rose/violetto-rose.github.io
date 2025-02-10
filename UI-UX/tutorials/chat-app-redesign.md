# Chat App Redesign

Let's begin our first experiment: A Chat App Redesign where we will create a wireframe and redesign the user interface of a well-known chat application. We will be using Figma as our design tool throughout this tutorial, as recommended by the university.

For our experiment, we'll focus on <span class="WhatsApp">WhatsApp</span>, a widely-used messaging platform from Meta. WhatsApp exemplifies excellent user interface design through its intuitive navigation, clear visual hierarchy, and consistent design patterns.

![WhatsApp interface on Apple iOS and Android](images/chat-app-redesign/whatsapp-user-interface.png)
*New iOS and Android user interface on WhatsApp. Image courtesy of Meta Design, 2024.*

Lets start with creating home screen interface of WhatsApp

---

## 1. Get familiar with tools in Figma

![Description about tools in figma](images/chat-app-redesign/tools.jpg)
For more details about other tools, visit [Figma&#39;s toolbar help page](https://help.figma.com/hc/en-us/articles/360041064174-Access-design-tools-from-the-toolbar).

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

---
## 3. Designing

We're going to need icons for designing this interface. The easiest way to get icons is by using plugins in Figma.

1. Let's download the [Iconify](https://www.figma.com/community/plugin/735098390272716381/iconify) plugin.

Pro tip: You can also search for the plugin directly within Figma and run it from the plugins menu.

### ▶ Creating a Frame

We'll create a frame similar to our previous wireframing process:

1. We'll use the **Android Compact** frame again to maintain consistency with our earlier design.

![Creating a Frame](images/chat-app-redesign/design-1.png)

### ▶ Adding the Status Bar

1. Select the **Frame** tool from the toolbar and place it on the canvas.
2. Configure the frame with these specific dimensions:
   - Width: **412** pixels
   - Height: **50** pixels
   - Alignment: **Top** of the screen

![Adding the Status Bar](images/chat-app-redesign/design-2.png)

### ▶ Adding Status Bar Icons and Time

1. Open the Iconify plugin from the Actions menu.

![Iconify plugin](images/chat-app-redesign/design-3.png)

2. Search for a **Battery** icon and select your preferred design.

![Search for desired Icon](images/chat-app-redesign/design-4.png)

3. Import the icon as a frame or component to preserve its scalability.

![Import the Icon](images/chat-app-redesign/design-5.png)

4. Similarly, import **Wi-Fi** and **Signal** icons to complete the system indicators.
5. Adjust the icons:
   - Height: **15** pixels
   - Alignment: **Right-center** of the status bar

![Position the Icons](images/chat-app-redesign/design-6.png)

6. Use the **Text Tool (T)** to add the time display.
7. Configure the time text:
    - Font: Regular
    - Size: **18** pixels
    - Position: **x = 20, y = 18**

Note: You can download Helvetica Neue font [here](https://violetto-rose.github.io/UI-UX/public/resources/Helvetica-Neue.zip).

![Add the Time](images/chat-app-redesign/design-7.png)

### ▶ Adding the WhatsApp Branding

1. Use the **Text Tool (T)** to add "WhatsApp" in the branding area.
2. Configure the branding text:
    - Width: **280** pixels
    - Height: **80** pixels
    - Font: Bold
    - Size: **24** pixels
    - Color: **#2BAF6A**
    - Position: **x = 20, y = 50**

![Adding the WhatsApp Branding](images/chat-app-redesign/design-8.png)

### ▶ Adding Camera and Settings Icons

1. Search for Camera and Dot icons in the Iconify plugin.
2. Prepare the icons:
    - Height: **20** pixels
    - Position: **Right** side of the branding

![Adding Camera and Settings Icon](images/chat-app-redesign/design-9.png)

### ▶ Creating the Search Bar

1. Create a new frame for the search container:
   - Dimensions: **412 x 50** pixels

![Adding Search Container](images/chat-app-redesign/design-10.png)

2. Add the search bar rectangle:
   - Dimensions: **372 x 50** pixels
   - Corner radius: **50** pixels (for rounded edges)
   - Alignment: Centered horizontally

![Adding Search Bar](images/chat-app-redesign/design-11.png)

3. Design the Meta AI icon:
   - Import an annulus icon (circular shape with a hole)
   - Dimensions: **20 x 20** pixels
   - Position: **x = 20** (left side of search bar)

4. Style the Meta AI icon:
   - Apply a linear gradient color:
     * 0%: **#E475DC**
     * 50%: **#0064DD**
     * 100%: **#17E3BB**
   - Add an outside stroke:
     * Thickness: **1** pixel
     * Use the same gradient color

![Adding Meta AI Icon](images/chat-app-redesign/design-12.png)

5. Refine the icon placement:
   - Rotate the annulus to **-45** degrees for a dynamic look

![Rotating Meta AI Icon](images/chat-app-redesign/design-13.png)

6. Add search bar text:
   - Text: "Ask Meta AI or Search"
   - Font size: **16** pixels
   - Font weight: Regular
   - Color: **#686F74**

![Add Placeholder to Search Bar](images/chat-app-redesign/design-14.png)

### ▶ Adding Gesture Bar (Optional)

This subtle design element helps improve the mobile interface feel:

1. Create a gesture indicator:
   - 1Shape: **Rectangle**
   - Dimensions: **90 x 3** pixels
   - Vertical position: **y = 905**
   - Color: **#BDBDBD**

![Adding Gesture Bar](images/chat-app-redesign/design-15.png)

### ▶ Creating the Navigation Bar

1. Create the navigation frame:
   - Dimensions: **412 x 100** pixels
   - Vertical position: **y = 797**

![Creating the Navigation Bar](images/chat-app-redesign/design-16.png)

2. Add navigation buttons:
   - Number of buttons: **4**
   - Individual button dimensions: **70 x 35** pixels
   - Corner radius: **50** pixels
   - Vertical position: **y = 15**

![Adding Navigation Bar Buttons](images/chat-app-redesign/design-17.png)

3. Modify button colors:
   - First button: **#D9FDD3**
   - Remaining buttons: **#FFFFFF**

![Change Color of Navigation Bar Buttons](images/chat-app-redesign/design-18.png)

4. Add navigation labels:
   - Font size: **12** pixels
   - Font weight: Medium
   - Labels: **Chats, Updates, Communities, Calls**

![Adding Navigation Bar Text](images/chat-app-redesign/design-19.png)

5. Add navigation icons:
   - Use Iconify plugin to find matching icons
   - One icon for each label: **Chats, Updates, Communities, Calls**

![Adding Navigation Bar Icons](images/chat-app-redesign/design-20.png)

### ▶ Adding Filter Buttons

1. Create a dedicated frame for filter buttons:
   - Dimensions: **412 x 70** pixels
   - Position: Placed directly below the search bar

![Adding Filter Buttons Frame](images/chat-app-redesign/design-21.png)

2. Design three distinct filter buttons:
   - "All" button:
     * Dimensions: **50 x 30** pixels
   - "Unread" button:
     * Dimensions: **80 x 30** pixels
   - "Groups" button:
     * Dimensions: **80 x 30** pixels

3. Apply consistent styling to the buttons:
   - Corner radius: **50** pixels
   - Color scheme:
     * First button (All): **#D9FDD3**
     * Other buttons: **#F6F5F4**

![Adding Filter Buttons](images/chat-app-redesign/design-22.png)

4. Add text to the buttons:
   - Font weight: Bold
   - Font size: **14** pixels
   - Text color variations:
     * "All" button text: **#216947**
     * "Unread" and "Groups" text: **#686F74**

![Adding Filter Buttons Text](images/chat-app-redesign/design-23.png)
![Adding Filter Buttons Text](images/chat-app-redesign/design-24.png)

### ▶ Creating the Chat List

1. Create the main chat list container:
   - Dimensions: **412 x 551** pixels

![Creating the Chat List](images/chat-app-redesign/design-25.png)

2. Design an individual chat preview:
   - Sub-container dimensions: **412 x 80** pixels
   - Represents a single conversation entry

![Creating individual Chat](images/chat-app-redesign/design-26.png)

3. Add a contact icon:
   - Shape: Circle
   - Dimensions: **50 x 50** pixels
   - Represents the chat partner's profile picture

![Adding contact icon](images/chat-app-redesign/design-27.png)

4. Include text elements for each chat preview:
   - Contact name:
     * Size: **18** pixels
     * Weight: Bold
     * Color: **#1E1E1E**
   - Last message:
     * Size: **16** pixels
     * Weight: Regular
     * Color: **#686F74**
   - Time:
     * Size: **14** pixels
     * Weight: Regular
     * Color: **#686F74**

![Adding Chat contents](images/chat-app-redesign/design-28.png)
![Adding Chat contents](images/chat-app-redesign/design-29.png)

5. Populate the chat list:
   - Duplicate the chat preview container
   - Create multiple entries

![Populate Chat List](images/chat-app-redesign/design-30.png)

6. Customize chat entries:
   - Modify names, messages, and times
   - Create visual variety
   - Represent different types of conversations

![Customize Chat Entries](images/chat-app-redesign/design-31.png)

### ▶ Final Design

With these meticulous steps, we've created a comprehensive, user-friendly design for the WhatsApp interface. The design balances functionality with aesthetic appeal, providing an intuitive user experience.

![Final Design](images/chat-app-redesign/design.png)