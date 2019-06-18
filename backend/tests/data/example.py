import pandas as pd
from sklearn import datasets

example_X, example_y = datasets.make_classification(
    n_samples=200,
    n_features=5,
    n_informative=5,
    n_redundant=0,
    n_classes=2,
    n_clusters_per_class=1,
    n_repeated=0,
    shuffle=False,
    random_state=0,
)


def data_to_file(X, y, file_name):
    d = {}
    for i in range(X.shape[1]):
        d["feature_{0}".format(i)] = X[:, i]
    d["target"] = y
    df = pd.DataFrame(d)
    df.to_csv(file_name, index=False)
