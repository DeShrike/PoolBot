import json
import numpy as np

data = {}

data['people'] = []

data['people'].append({
    'name': 'Scott',
    'website': 'stackabuse.com',
    'from': 'Nebraska'
})
data['people'].append({
    'name': 'Larry',
    'website': 'google.com',
    'from': 'Michigan'
})
data['people'].append({
    'name': 'Tim',
    'website': 'apple.com',
    'from': 'Alabama'
})

bias = np.array([-1, 2, 4, -7, 1, 10])
weights = np.random.random((3,4))
print(bias)
print(bias.shape)
print(weights)
print(weights.shape)

data["brain"] = {
    "weights": weights.tolist(),
    "bias": bias.tolist(),
    "nodes": 5
}

with open('data.json', 'w') as outfile:
    json.dump(data, outfile, indent=4)

print("-----------------------------------")
jj = json.dumps(data, indent=4)
print(jj)
print("-----------------------------------")

with open('data.json') as json_file:
    data = json.load(json_file)
    for p in data['people']:
        print('Name: ' + p['name'])
        print('Website: ' + p['website'])
        print('From: ' + p['from'])
        print('')
    newweights = np.array(data["brain"]["weights"])
    newbias = np.array(data["brain"]["bias"])
    newnodes = data["brain"]["nodes"]
    print(newweights)
    print(newbias)
    print(newnodes)
