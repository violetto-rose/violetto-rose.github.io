# Social Media App

Let’s kick off our third experiment: a redesign of a social media application where we will create a wireframe and user interface for a popular platform.

For this experiment, we will focus on <span class="Instagram">Instagram</span>, a widely-loved social networking service owned by Meta. Instagram exemplifies outstanding user interface design through its visually appealing layout, intuitive navigation, and consistent design patterns. The platform offers users a seamless experience to share photos, connect with friends, and discover new content.

![Instagram interface on Apple iOS](images/social-media-app/instagram-user-interface.webp)
*Instagram interface on Apple iOS. Image source: Fast Company, September 2024.*

Let's begin by designing the home screen interface for Instagram, along with the restaurant page interface.

---
## 1. Wireframing

Create a basic wireframe using pen and paper, as demonstrated below:

![Wireframe](images/social-media-app/wireframe.png){data-aspect-ratio="1:1"}

---
## 2. Designing

> **Disclaimer**:
> 
> The Instagram Sans font is the intellectual property of its original author and is provided here for personal use only. This tutorial uses the font for educational purposes only. For commercial use, please ensure you obtain the appropriate license from the author. By downloading, you acknowledge that you respect the rights of the original creator.
> 
> You can download the Instagram Sans font **[here](https://violetto-rose.github.io/UI-UX/public/resources/Instagram-Sans.zip)**.

### ▶ Creating a Landing Page and Branding Container

1. Create a frame:
	- We'll use the **Android Compact** frame for this design.
	- Change the fill color to **#0C0F14**
2. Add status bar using **Status Bar 1-click** plugin.
3. Create a frame for branding container.
4. Configure frame:
    - Width: **412 (Hug)** pixels
    - Height: **50** pixels
    - Layout: Horizontal
    - Alignment: Center
    - Gap: **20** pixels
    - Horizontal padding: **0, 15** pixels
    - Vertical padding: **0**

![Creating Branding Container](images/social-media-app/design-1.png)

### ▶ Adding Branding Sub-Container

1. Create a frame for branding sub-container.
2. Configure frame:
    - Dimensions: **Fill**
    - Layout: Horizontal
    - Alignment: Left
    - Gap: **0**

![Adding Branding Sub-Container](images/social-media-app/design-2.png)

### ▶ Adding Branding

1. <span>Get the ![Instagram Brand Text](images/social-media-app/instagram.svg) brand text [here](https://violetto-rose.github.io/UI-UX/tutorials/images/social-media-app/instagram.svg).</span>

![Adding Branding](images/social-media-app/design-3.png)

2. Add arrow icon

![Adding Arrow Icon](images/social-media-app/design-4.png)

3. Add like and messenger icons

![Adding Like and Messenger Icons](images/social-media-app/design-5.png)

### ▶ Adding Story Container

1. Create a new frame for the story container:
2. Configure frame:
    - Dimensions: **412 x 120** pixels
    - Layout: Horizontal 
    - Alignment: Left
    - Horizontal padding: **5** pixels
    - Vertical padding: **0**

![Adding Story Container](images/social-media-app/design-6.png)

3. Create a new frame for the your story container:
4. Configure frame:
    - Dimensions: **90 x 120** pixels
    - Layout: Vertical 
    - Alignment: Bottom Center
    - Gap: **4** pixels
    - Horizontal padding: **0**
    - Vertical padding: **0, 5** pixels

![Adding Your Story Container](images/social-media-app/design-7.png)

5. Create a new frame for the your story:
6. Configure frame:
    - Dimensions: **Fill x 85** pixels

![Adding Your Story](images/social-media-app/design-8.png)

7. Add a circle for profile picture:
	- Dimensions: **75 x 75** pixels
	- Stroke:
		- Color: **#222629**
		- Position: Inside
8. Add a circle for add button:
	- Dimensions: **75 x 75** pixels
	- Color: **#FFFFFF**
	- Stroke:
		- Color: **#000000**
		- Position: Inside
		- Thickness: **2** pixels
9. Add a plus icon

![Adding Your Story icons](images/social-media-app/design-9.png)

10. Add a text element for your story:
	- Size: **11** pixels

![Adding Your Story Text](images/social-media-app/design-10.png)

11. Similarly add other stories
12. Add a gradient outline for status:
	- Color: Linear gradient (**#FFD600** to **#FF7A00** to **#FF0069** to **#D300C5**)
	- Rotation: **45** degree

![Creating Other Stories](images/social-media-app/design-11.png)

13. Duplicate the stories

![Duplicating Stories](images/social-media-app/design-12.png)

### ▶ Creating the Navigation Bar

1. Create the navigation frame:
	- Dimensions: **412 x 65** pixels
	- Layout: Horizontal 
	- Alignment: Top
	- Gap: Auto
	- Horizontal padding: **25** pixels
	- Stroke: 
		- Color: **#22252A**
		- Position: Inside
		- Sides: Top

![Creating the Navigation Bar](images/social-media-app/design-13.png)

2. Add home, search, add box, play list, and profile icons:
	- Dimensions: **30 x 30** pixels

![Adding Navigation Icons](images/social-media-app/design-14.png)

### ▶ Creating the Body Container

1. Create a frame:
	- Dimensions: **412 x 796** pixels
	- Layout: Vertical 
	- Alignment: Left
	- Gap, Horizontal padding & Vertical padding: **0**

![Creating the Body Container](images/social-media-app/design-15.png)

### ▶ Creating Posts

Let's create individual posts as shown below, which we will then place inside the body container.

![Creating Posts](images/social-media-app/design-16.png)

### ▶ Creating Posts Container

1. Create a frame:
	- Dimensions: **Hug**
	- Layout: Vertical 
	- Alignment: Top Center
	- Gap, Horizontal padding & Vertical padding: **0**
### ▶ Creating Header Sub-Container

1. Create a header container:
	- Dimensions: **412 x 54** pixels
	- Layout: Horizontal 
	- Alignment: Center
	- Gap: Auto
	- Vertical padding: **0**

![Creating Header Sub-Container](images/social-media-app/design-17.png)

2. Create a Name Container:
	- Dimensions: **Fill**
	- Layout: Horizontal
	- Alignment: Left
	- Gap: **6** pixels
	- Horizontal padding & Vertical padding: **0**

![Creating Name Container](images/social-media-app/design-18.png)

3. Add profile icon from story container.
4. Add text element for name.
5. Add verified icon.

![Adding Name Container Elements](images/social-media-app/design-19.png)

6. Add more options icon.

![Adding More Options Icon](images/social-media-app/design-20.png)

### ▶ Creating Post Image Container

1. Create a Image container of required dimensions:
	- Layout: Horizontal
	- Alignment: Bottom Left
	- Horizontal padding & Vertical padding: **14**

![Creating Post Image Container](images/social-media-app/design-21.png)

2. Add a person icon:
	- Fill: **#000000** at **80%** opacity
	- Cornering-radius: **50** pixels

![Adding Post Image](images/social-media-app/design-22.png)

### ▶ Creating Button Container

1. Create a Button container:
	- Dimensions: **412 x 50** pixels
	- Layout: Horizontal 
	- Alignment: Center
	- Vertical padding: **0**

![Creating Button Container](images/social-media-app/design-23.png)

2. Create a like, comment and share sub-container:
	- Dimensions: **Fill** 
	- Layout: Horizontal 
	- Alignment: Left
	- Horizontal padding & Vertical padding: **0**

![Creating Button Sub-Container](images/social-media-app/design-24.png)

3. Add like, comment, share and bookmark icons.

![Adding Button Icons](images/social-media-app/design-25.png)

![Adding Button Icons](images/social-media-app/design-26.png)
### ▶ Creating Post Description Container

1. Create a frame:
	- Dimensions: **Fill x Hug** 
	- Layout: Vertical 
	- Alignment: Top Left
	- Gap, Horizontal padding & Vertical padding: **0**

![Creating Post Description Container](images/social-media-app/design-27.png)

2. Add Text Elements.

![Adding Post Description Text Elements](images/social-media-app/design-28.png)

3. Move branding, story and posts containers inside body container.

![Body Container](images/social-media-app/design-30.png)

### ▶ Creating a Accounts Page and Duplicating Navigation Bar 

1. Create a frame:
	- We'll use the **Android Compact** frame for this design.
	- Change the fill color to **#0C0F14**
2. Add status bar using **Status Bar 1-click** plugin.
3. Duplicate the navigation bar.

![Creating a Accounts Page and Duplicating Navigation Bar](images/social-media-app/design-31.png)

### ▶ Adding Header Container

1. Create a new frame for the header container:
2. Configure frame:
    - Dimensions: **412 x 65** pixels
    - Layout: Horizontal 
    - Alignment: Center

![Adding Header Container](images/social-media-app/design-32.png)

3. Add back icon, text container and more options icon.

![Adding Header Elements](images/social-media-app/design-33.png)

### ▶ Adding Account Information Container

1. Create a new frame for the account information container:
2. Configure frame:
    - Dimensions: **412 x 220** pixels
    - Layout: Vertical 
    - Alignment: Center
	- Gap, Horizontal padding & Vertical padding: **0**

![Adding Account Information Container](images/social-media-app/design-34.png)

3. Create a new frame for the account status container:
4. Configure frame:
    - Dimensions: **Fill**
    - Layout: Vertical 
    - Alignment: Center
5. Add a circle for profile picture:
	- Dimensions: **80 x 80** pixels

![Adding Account Status Container](images/social-media-app/design-35.png)

6. Create a new frame for the account info:
7. Configure frame:
    - Dimensions: **Fill**
    - Layout: Horizontal
    - Alignment: Center

![Adding Account Info](images/social-media-app/design-36.png)

8. Create three frames for posts, followers and following:
9. Configure frame:
    - Dimensions: **Fill**
    - Layout: Horizontal
    - Alignment: Center

![Adding Account Status Sub-Containers](images/social-media-app/design-37.png)

10. Add text elements.

![Adding Text Elements](images/social-media-app/design-38.png)

11. Create a new frame for the about section:
12. Configure frame:
    - Dimensions: **Fill**
    - Layout: Vertical
    - Alignment: Center
    - Gap & Vertical Padding: **0**

![Adding About Section](images/social-media-app/design-39.png)

13. Create a new frame for the bio:
14. Configure frame:
    - Dimensions: **Fill x Hug**
    - Layout: Horizontal
    - Alignment: Center
	- Gap, Horizontal padding & Vertical padding: **0**

![Adding Bio](images/social-media-app/design-40.png)

15. Add text elements.

![Adding Bio](images/social-media-app/design-41.png)

16. Create a new frame for the button container:
17. Configure frame:
    - Dimensions: **Fill**
    - Layout: Horizontal
    - Alignment: Center
	- Gap: **8** pixels
	- Horizontal padding & Vertical padding: **0**

![Adding Button Container](images/social-media-app/design-42.png)

18. Create three frames for posts, followers and following:
19. Configure frame:
    - Width: **Fill, Fill, Hug**
    - Height: **34** pixels
    - Alignment: Center
20. Reduce the vertical and horizontal padding of add button to **5** pixels

![](images/social-media-app/design-43.png)

### ▶ Creating the Account Nav Container

1. Create a frame:
	- Dimensions: **412 x 70** pixels
	- Layout: Horizontal 
	- Alignment: Center
	- Gap: Auto
	- Horizontal padding: **25** pixels
	- & Vertical padding: **0**

![](images/social-media-app/design-44.png)

2. Create three frames for posts, reels and tags:
3. Configure frame:
    - Dimensions: **80 x Fill** pixels
    - Layout: Horizontal
    - Alignment: Bottom Center

![](images/social-media-app/design-45.png)

4. Add 9 dots, play list and person outline icons.

![](images/social-media-app/design-46.png)

### ▶ Creating Posts Container

1. Create a frame:
	- Dimensions: **412 x Hug** pixels
	- Layout: Wrap 
	- Alignment: Center
	- Gap, Horizontal padding & Vertical padding: **0**

![](images/social-media-app/design-47.png)

### ▶ Creating Post Sub-Container

1. Create a container:
	- Dimensions: **137.33 x 137.33** pixels

![](images/social-media-app/design-48.png)

2. Duplicate the frames

![](images/social-media-app/design-49.png)

### ▶ Connect the pages using the Prototype option

1. Connect the **Name** container to the **Account** page to navigate to the account page.
2. Connect the **Back** button and **Home** button to return to the **Landing** page.

![](images/social-media-app/design-50.png)

### ▶ Final Design

With these meticulous steps, we've created a comprehensive, user-friendly design for the Zomato interface. The design balances functionality with aesthetic appeal, providing an intuitive user experience.

![Final Design](images/social-media-app/design.png)

---