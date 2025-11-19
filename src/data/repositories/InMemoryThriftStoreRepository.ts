import type { ThriftStore } from "../../domain/entities/ThriftStore";
import type { ThriftStoreRepository } from "../../domain/repositories/ThriftStoreRepository";

const featured: ThriftStore[] = [
  {
    id: "vintage-vibes",
    name: "Vintage Vibes",
    description: "Garimpos curados com pegada retrô.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARBJPDQo7Uu8yQM4xPWLRoF-_TeSBcst8BBMAz0dACZaF9hNuYW9fyZlskN-VCyBUbQLMCPqLMBf_t1YGByk0mVteVZPK7QC3OpMdu9GR3BnopzabXnSwodUhMLJyvJj9rxOFVE9uZZZE_g7BJaxt8WTigdOQ7RmKc4Py36Z_K2ZrQuIxCdU1YJJEn9prdha2DUr9YzrNNjkyVxtQM3_0GCJFBYsJjYaPQ2B4ng6rdqa3D9gMNc_dDlJS1Jwrk5tLGtld_Y6fqaNQ",
    badgeLabel: "Mais amado",
    neighborhood: "Pinheiros",
    addressLine: "Rua Augusta, 123",
    distanceKm: 0.5,
    walkTimeMinutes: 5
  },
  {
    id: "secondhand-chic",
    name: "Secondhand Chic",
    description: "Peças de grife em segunda mão.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOVk3nq4m3vr37Zwd-diMYSVbsPlR3-vTbKQNtxhRnSFzz5nNb_gspC1GacDtcVHlCfAkPiabUO7DiaWj82Ej-3CXVcZBzVuAG5XwjY1lmi9MmE6TSzxBV_fpazCztCZqsZHb7-StUS-b319YJd2SziNcWu_BNV9L82uJ2e735mhIw2kdCWS0wq8xS8z7a9jNP4OOJkER7W8wXIihkJRDcKYuZ3IDi42wM_J04kfaUeprhiQ5LGy-5zz-xnE_nSs_1LKWuWxawUso",
    neighborhood: "Vila Madalena",
    addressLine: "Av. Paulista, 456",
    distanceKm: 1.2,
    walkTimeMinutes: 15
  },
  {
    id: "thrift-haven",
    name: "Thrift Haven",
    description: "Achadinhos baratos e estilosos.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-A56MKMnqcuWT0lhYX0X9SOhpoyVFIaIyUy5TWpClE7mViw4oDUJxTUEwW__iQthJ7jJ0I7T4G7CHX6xb5kdhUBSRgTeTKIlTCadoFlAC0hYc_Nks4AQlfwFj9uySe1CifrKjMNM3t4dL7pomHXYstDcgxPBwG4URxhbzxxEez2IXjcMDZ-gubenRb9YU6apfFVWOdYVRnz4GuTedBllJoW6-QJ6rl2B0mfGj_959s0bt0DYi4XqFt7JBX3LB49HAjk3MPPN0iqE",
    neighborhood: "Centro",
    addressLine: "Rua 7 de Abril, 90",
    distanceKm: 2.4,
    walkTimeMinutes: 28
  }
];

const nearby: ThriftStore[] = [
  {
    id: "garimpo-urbano",
    name: "Garimpo Urbano",
    description: "Mix de moda street e vintage.",
    imageUrl:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1400&q=70",
    distanceKm: 0.6,
    neighborhood: "Consolação",
    addressLine: "Rua da Consolação, 210",
    walkTimeMinutes: 8
  },
  {
    id: "querido-brecho",
    name: "Querido Brechó",
    description: "Curadoria feminina e genderless.",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=70",
    distanceKm: 1.2,
    neighborhood: "Higienópolis",
    addressLine: "Rua Sabará, 41",
    walkTimeMinutes: 15
  },
  {
    id: "revive",
    name: "Revive Vintage",
    description: "Peças clássicas restauradas.",
    imageUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=70",
    distanceKm: 2.1,
    neighborhood: "Bela Vista",
    addressLine: "Rua São Carlos do Pinhal, 15",
    walkTimeMinutes: 25
  }
];

export class InMemoryThriftStoreRepository implements ThriftStoreRepository {
  async getFeatured(): Promise<ThriftStore[]> {
    return featured;
  }

  async getNearby(): Promise<ThriftStore[]> {
    return nearby;
  }
}
