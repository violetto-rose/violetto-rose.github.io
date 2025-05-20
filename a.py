# 1
import matplotlib
matplotlib.use('TkAgg')
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_california_housing

data = fetch_california_housing(as_frame=True)
df = data.frame

n_columns = 3
n_rows = (len(df.select_dtypes(include=['float64', 'int64']).columns) * 2 + n_columns - 1) // n_columns
fig, axes = plt.subplots(n_rows, n_columns, figsize=(15, 10))
axes = axes.flatten()

columns = df.select_dtypes(include=['float64', 'int64']).columns

for i, column in enumerate(columns):
    ax = axes[i]
    df[column].hist(bins=30, edgecolor='black', ax=ax)
    ax.set(title=f"Histogram of {column}", xlabel=column, ylabel="Frequency")
    ax = axes[len(columns) + i]
    df.boxplot(column=column, grid=False, ax=ax)
    ax.set(title=f"Box Plot of {column}")

plt.tight_layout()
plt.savefig("combined_plots.png")
plt.show()

# 2
import matplotlib
matplotlib.use('TkAgg')
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_california_housing

df = fetch_california_housing(as_frame=True).frame

fig, axes = plt.subplots(2, 1, figsize=(12, 12))

sns.heatmap(df.corr(), annot=True, fmt=".2f", cmap="coolwarm", cbar=True, ax=axes[0])
axes[0].set_title("Correlation Matrix Heatmap")

sns.pairplot(df[['MedInc', 'HouseAge', 'AveRooms', 'AveOccup', 'MedHouseVal']], diag_kind="kde")

plt.subplots_adjust(hspace=0.4)

plt.show()

# 3
import matplotlib
matplotlib.use('TkAgg')
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler

iris = load_iris()
df = pd.DataFrame(iris.data, columns=iris.feature_names)

scaler = StandardScaler()
scaled_data = scaler.fit_transform(df)

pca = PCA(n_components=2)
pca_result = pca.fit_transform(scaled_data)

pca_df = pd.DataFrame(pca_result, columns=['PC1', 'PC2'])

plt.figure(figsize=(8, 6))
plt.scatter(pca_df['PC1'], pca_df['PC2'], c=iris.target, cmap='viridis')
plt.title("PCA of Iris Dataset (2 components)")
plt.xlabel("Principal Component 1")
plt.ylabel("Principal Component 2")
plt.colorbar(label='Target')
plt.show()

# 4
import pandas as pd

df = pd.read_csv('training_data.csv')
X = df.iloc[:, :-1]
y = df.iloc[:, -1]

def find_s_algorithm(X, y):
    hypothesis = ['?' for _ in range(X.shape[1])]
    for i in range(len(X)):
        if y[i] == 'Yes':
            for j in range(len(X.columns)):
                if hypothesis[j] == '?' or hypothesis[j] == X.iloc[i, j]:
                    hypothesis[j] = X.iloc[i, j]
                else:
                    hypothesis[j] = '?'
    return hypothesis

hypothesis = find_s_algorithm(X, y)
print("Hypothesis consistent with the positive examples:", hypothesis)

# 5
import matplotlib
matplotlib.use('TkAgg')
import numpy as np
import matplotlib.pyplot as plt
from sklearn.neighbors import KNeighborsClassifier

np.random.seed(42)
x_values = np.random.rand(100, 1)

y_labels = np.array(['Class1' if x <= 0.5 else 'Class2' for x in x_values.flatten()])

X_train = x_values[:50]
y_train = y_labels[:50]
X_test = x_values[50:]
y_test = y_labels[50:]

k_values = [1, 2, 3, 4, 5, 20, 30]
plt.figure(figsize=(12, 8))
for i, k in enumerate(k_values, 1):
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)
    plt.subplot(3, 3, i)
    plt.scatter(X_test, y_test, color='blue', label='True Label')
    plt.scatter(X_test, y_pred, color='red', marker='x', label='Predicted Label')
    plt.title(f"KNN with k={k}")
    plt.xlabel("X value")
    plt.ylabel("Class Label")
    plt.legend(loc='best')
    plt.grid(True)
plt.tight_layout()
plt.show()

for k in k_values:
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train)
    accuracy = knn.score(X_test, y_test)
    print(f"Accuracy for k={k}: {accuracy:.2f}")
    
# 6
import matplotlib
matplotlib.use('TkAgg')
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split

data = fetch_california_housing(as_frame=True)
df = data.frame
X = df['MedInc'].values.reshape(-1, 1)
y = df['MedHouseVal'].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

def locally_weighted_regression(X_train, y_train, X_test, tau=0.1):
    predictions = []
    for x in X_test:
        weights = np.exp(-np.sum((X_train - x) ** 2, axis=1) / (2 * tau ** 2))
        X_train_b = np.c_[np.ones((X_train.shape[0], 1)), X_train]
        theta, _, _, _ = np.linalg.lstsq(X_train_b * weights[:, np.newaxis], y_train * weights, rcond=None)
        X_test_b = np.c_[1, x]
        predictions.append(X_test_b @ theta)
    return np.array(predictions)

y_pred = locally_weighted_regression(X_train, y_train, X_test, tau=0.1)

plt.scatter(X_test, y_test, color='blue', label='True values')
plt.scatter(X_test, y_pred, color='red', label='Predicted values')
plt.xlabel('Median Income')
plt.ylabel('Median House Value')
plt.title('Locally Weighted Regression (LWR)')
plt.legend()
plt.grid(True)
plt.show()

mse = np.mean((y_pred - y_test) ** 2)
print(f"Mean Squared Error: {mse:.4f}")

# 7
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.datasets import fetch_california_housing

data = fetch_california_housing(as_frame=True)
X = data.data[['AveRooms']]
y = data.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

linear_reg = LinearRegression()
linear_reg.fit(X_train, y_train)
y_pred = linear_reg.predict(X_test)

poly = PolynomialFeatures(degree=3)
X_poly = poly.fit_transform(X_train)
poly_reg = LinearRegression()
poly_reg.fit(X_poly, y_train)
y_pred_poly = poly_reg.predict(poly.fit_transform(X_test))

plt.subplot(1, 2, 1)
plt.scatter(X_test, y_test, color='blue')
plt.plot(X_test, y_pred, color='red')
plt.title('Linear Regression')

plt.subplot(1, 2, 2)
plt.scatter(X_test, y_test, color='blue')
plt.plot(X_test, y_pred_poly, color='green')
plt.title('Polynomial Regression')

plt.tight_layout()
plt.show()

print(f"Linear Regression - MSE: {mean_squared_error(y_test, y_pred):.4f}")
print(f"Polynomial Regression - MSE: {mean_squared_error(y_test, y_pred_poly):.4f}")

# 8
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import numpy as np

data = load_breast_cancer()
X = data.data
y = data.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

clf = DecisionTreeClassifier(random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy on Test Set: {accuracy:.4f}')

new_sample = X_test[0].reshape(1, -1)
predicted_class = clf.predict(new_sample)

print(f'Predicted Class for New Sample: {"Benign" if predicted_class == 1 else "Malignant"}')

# 9
import numpy as np
from scipy.io import loadmat
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

data = loadmat('olivettifaces.mat')
print("Keys in the dataset:", data.keys())

X = data['faces']
y = np.repeat(np.arange(40), 10)
X = X.T

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model = GaussianNB()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")

# 10
import matplotlib
matplotlib.use('TkAgg')
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler

data = load_breast_cancer()
X = data.data

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

kmeans = KMeans(n_clusters=2, random_state=42)
y_kmeans = kmeans.fit_predict(X_scaled)

plt.figure(figsize=(10, 6))
plt.scatter(X_scaled[:, 0], X_scaled[:, 1], c=y_kmeans, cmap='viridis', edgecolors='k')
plt.title('K-Means Clustering (2D) on Wisconsin Breast Cancer Data')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.colorbar(label='Cluster')
plt.show()

print("Cluster centers:\n", kmeans.cluster_centers_)