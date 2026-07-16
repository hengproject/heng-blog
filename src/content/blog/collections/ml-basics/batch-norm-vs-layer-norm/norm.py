import torch

torch.manual_seed(2025)
batch_size = 100
features = 20
x = torch.randn(batch_size, features)

def batch_normalization(x, gamma, beta, eps=1e-5):
    batch_mean = torch.mean(x, dim=0, keepdim=True)
    batch_var = torch.var(x, dim=0, keepdim=True, correction=0)
    x_hat = (x - batch_mean) / torch.sqrt(batch_var + eps)
    return gamma * x_hat + beta


y = batch_normalization(x, gamma=1, beta=0)
print(y.shape, torch.mean(y).item(), torch.var(y, correction=0).item())