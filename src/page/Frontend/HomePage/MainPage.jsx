import React, { useEffect, useState } from "react";
import request from "../../../utils/request";

const API_BASE_URL = "http://localhost:3000";
const FALLBACK_IMAGE =
	"https://lh3.googleusercontent.com/aida-public/AB6AXuDnWA3R0m9y899YwaQX4jlS5mV4KX6meTGi-yj1WuvXRENDDVctlhO0L8h93LpGw-tyxtts1ijDVWO0oeSIKTst-rTLd62zYBvYBe8CKlgb4qkfSHhWiNeVFQXqVllZ4r8Vphat_twk9Pdo8gHWXQgrnb4g3E2rcZaQfXfHUIbHyZ9enuqdnk3Xoc5T7E04NV6sz5tG443BmRin00wyQCqWm9KGRehLMH9kDXGgdvQKBXBT0H_bnfz5ORjpSPBGIpCkKD_ik-tl5dwL";

const formatPrice = (value) => {
	const amount = Number(value || 0);
	return `$${amount.toFixed(2)}`;
};

const MainPage = () => {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const loadProducts = async () => {
			try {
				setIsLoading(true);
				setErrorMessage("");

				const response = await request("api/product", "GET");
				const rows = Array.isArray(response?.data) ? response.data : [];

				const mappedProducts = rows.map((item) => ({
					id: item.prd_id,
					brand: item.brand_id || "Generic Brand",
					name: item.prd_name || item.prd_id || "Unnamed Product",
					price: formatPrice(item.unit_cost),
					rating: ["star", "star", "star", "star", "star"],
					lastStarMuted: true,
					image: item.photo ? `${API_BASE_URL}${item.photo}` : FALLBACK_IMAGE,
					alt: item.prd_name || "Product image",
				}));

				setProducts(mappedProducts);
			} catch (error) {
				setErrorMessage(
					error?.response?.data?.message || "Cannot load products from API"
				);
				setProducts([]);
			} finally {
				setIsLoading(false);
			}
		};

		loadProducts();
	}, []);

	return (
		<div className="relative flex min-h-screen w-full flex-col bg-background-light font-display text-text-light dark:bg-background-dark dark:text-text-dark">
			<header className="sticky top-0 z-50 flex items-center justify-center whitespace-nowrap border-b border-border-light bg-background-light/80 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/80">
				<div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
					<div className="flex items-center gap-8">
						<div className="flex items-center gap-3 text-primary dark:text-white">
							<span className="material-symbols-outlined text-2xl">storefront</span>
							<h1 className="text-xl font-bold">Shopify</h1>
						</div>
						<nav className="hidden items-center gap-8 md:flex">
							<a className="text-sm font-medium hover:text-accent dark:hover:text-accent" href="#">Home</a>
							<a className="text-sm font-medium hover:text-accent dark:hover:text-accent" href="#">Shop</a>
							<a className="text-sm font-medium hover:text-accent dark:hover:text-accent" href="#">About</a>
						</nav>
					</div>
					<div className="flex flex-1 items-center justify-end gap-4">
						<div className="relative hidden w-full max-w-xs items-center sm:flex">
							<span className="material-symbols-outlined absolute left-3 text-subtle-light dark:text-subtle-dark">search</span>
							<input
								className="w-full rounded-lg border-border-light bg-card-light py-2 pl-10 pr-4 text-sm focus:border-accent focus:ring-accent dark:border-border-dark dark:bg-card-dark"
								placeholder="Search products..."
								type="text"
							/>
						</div>
						<button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
							<span className="material-symbols-outlined">person</span>
						</button>
						<button className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
							<span className="material-symbols-outlined">favorite</span>
							<span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">2</span>
						</button>
						<button className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
							<span className="material-symbols-outlined">shopping_bag</span>
							<span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">3</span>
						</button>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<section className="mb-12">
					<div
						className="relative flex min-h-[400px] items-center justify-center rounded-xl bg-cover bg-center bg-no-repeat p-8 text-center"
						style={{
							backgroundImage:
								'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDAxXKQEL1_G40VZBFQGNGnf0Rhr4ocKtoDfxlJeYVf4uLXN3u8qN1E6BFSq3VHwgCwWqqV69pny9qaPsw_gn_MH_QkPxfO_A4Y_ZsFOarxVR-wBjIM3rHZfcbSo4nTWg7ACKQ7KsPpr-7j98A_L0sVHclUSlkVCnGDuwtl8D8iOZ2hh-B3D-R3-LPKJA57j6sxyMc_aO8KPnxY2Hg4J5WxdGosOjbeBDIHqvf_8vRtgTjnplwq5AV2plwiRdXfz9qlGoic06bAnBx3")',
						}}
					>
						<div className="flex max-w-2xl flex-col gap-4">
							<h2 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
								Summer Collection - Up to 30% Off
							</h2>
							<p className="text-base text-white/90 md:text-lg">
								Discover the latest trends and styles for the season.
							</p>
							<div className="mt-4">
								<button className="flex h-12 items-center justify-center rounded-lg bg-accent px-6 text-base font-bold text-white shadow-lg transition-transform hover:scale-105">
									Shop Now
								</button>
							</div>
						</div>
					</div>
				</section>

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
					<aside className="col-span-1 lg:col-span-1">
						<div className="sticky top-24">
							<h3 className="mb-4 text-xl font-bold">Filters</h3>
							<div className="space-y-6">
								<details className="group" open>
									<summary className="flex cursor-pointer items-center justify-between py-2 font-medium">
										Category
										<span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
									</summary>
									<div className="space-y-2 pt-2">
										<label className="flex items-center gap-2"><input defaultChecked className="rounded border-border-light text-accent focus:ring-accent" type="checkbox" /> T-Shirts</label>
										<label className="flex items-center gap-2"><input className="rounded border-border-light text-accent focus:ring-accent" type="checkbox" /> Hoodies</label>
										<label className="flex items-center gap-2"><input className="rounded border-border-light text-accent focus:ring-accent" type="checkbox" /> Jeans</label>
										<label className="flex items-center gap-2"><input className="rounded border-border-light text-accent focus:ring-accent" type="checkbox" /> Shoes</label>
									</div>
								</details>

								<div className="border-t border-border-light pt-6 dark:border-border-dark">
									<p className="mb-4 font-medium">Price Range</p>
									<div className="relative h-1 w-full rounded-full bg-border-light dark:bg-border-dark">
										<div className="absolute h-1 rounded-full bg-primary dark:bg-accent" style={{ left: "10%", right: "30%" }} />
										<div className="absolute -top-1.5" style={{ left: "10%" }}>
											<div className="h-4 w-4 cursor-pointer rounded-full border-2 border-background-light bg-primary dark:border-background-dark dark:bg-accent" />
											<span className="absolute left-1/2 top-5 -translate-x-1/2 text-sm text-subtle-light dark:text-subtle-dark">$50</span>
										</div>
										<div className="absolute -top-1.5" style={{ right: "30%" }}>
											<div className="h-4 w-4 cursor-pointer rounded-full border-2 border-background-light bg-primary dark:border-background-dark dark:bg-accent" />
											<span className="absolute left-1/2 top-5 -translate-x-1/2 text-sm text-subtle-light dark:text-subtle-dark">$350</span>
										</div>
									</div>
								</div>

								<details className="group border-t border-border-light pt-6 dark:border-border-dark" open>
									<summary className="flex cursor-pointer items-center justify-between py-2 font-medium">
										Brand
										<span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
									</summary>
									<div className="space-y-2 pt-2">
										<label className="flex items-center gap-2"><input className="rounded border-border-light text-accent focus:ring-accent" type="checkbox" /> Nike</label>
										<label className="flex items-center gap-2"><input defaultChecked className="rounded border-border-light text-accent focus:ring-accent" type="checkbox" /> Adidas</label>
										<label className="flex items-center gap-2"><input defaultChecked className="rounded border-border-light text-accent focus:ring-accent" type="checkbox" /> Puma</label>
										<label className="flex items-center gap-2"><input className="rounded border-border-light text-accent focus:ring-accent" type="checkbox" /> Levi's</label>
									</div>
								</details>

								<div className="flex gap-4 border-t border-border-light pt-6 dark:border-border-dark">
									<button className="w-full rounded-lg bg-accent py-2.5 text-sm font-bold text-white">Apply Filters</button>
									<button className="w-full rounded-lg bg-border-light py-2.5 text-sm font-bold text-text-light dark:bg-border-dark dark:text-text-dark">Reset</button>
								</div>
							</div>
						</div>
					</aside>

					<div className="col-span-1 lg:col-span-3">
						<div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
							<p className="text-sm text-subtle-light dark:text-subtle-dark">
								Showing {products.length} results
							</p>
							<div className="flex items-center gap-2">
								<label className="text-sm font-medium" htmlFor="sort">Sort by:</label>
								<select className="rounded-lg border-border-light bg-card-light text-sm focus:border-accent focus:ring-accent dark:border-border-dark dark:bg-card-dark" id="sort">
									<option>Newest</option>
									<option>Price: Low to High</option>
									<option>Price: High to Low</option>
									<option>Top Rated</option>
								</select>
							</div>
						</div>

						{isLoading && (
							<p className="mb-4 text-sm text-subtle-light dark:text-subtle-dark">
								Loading products...
							</p>
						)}
						{!isLoading && errorMessage && (
							<p className="mb-4 text-sm text-red-500">{errorMessage}</p>
						)}

						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
							{products.map((item) => (
								<div
									key={item.id}
									className="group relative flex flex-col overflow-hidden rounded-xl bg-card-light shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-card-dark"
								>
									<a className="flex flex-grow flex-col" href="#">
										<div className="aspect-square w-full overflow-hidden">
											<img className="h-full w-full object-cover transition-transform group-hover:scale-105" src={item.image} alt={item.alt} />
										</div>
										<div className="flex flex-grow flex-col p-4">
											<h4 className="text-sm text-subtle-light dark:text-subtle-dark">{item.brand}</h4>
											<h3 className="mt-1 truncate text-lg font-bold">{item.name}</h3>
											<div className="my-2 flex items-center gap-1 text-accent">
												{item.rating.map((icon, index) => (
													<span
														key={`${item.name}-${icon}-${index}`}
														className={`material-symbols-outlined !text-base !font-bold ${item.lastStarMuted && index === 4 ? "text-border-light dark:text-border-dark" : ""}`}
													>
														{icon}
													</span>
												))}
											</div>
											<p className="mt-auto pt-2 text-xl font-bold">{item.price}</p>
										</div>
									</a>
									<button
										aria-label="Add to cart"
										className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white opacity-0 transition-opacity group-hover:opacity-100"
									>
										<span className="material-symbols-outlined">add_shopping_cart</span>
									</button>
								</div>
							))}
						</div>

						{!isLoading && !errorMessage && products.length === 0 && (
							<p className="mt-4 text-sm text-subtle-light dark:text-subtle-dark">
								No products available.
							</p>
						)}

						<nav className="mt-12 flex items-center justify-center gap-2">
							<button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5" disabled>
								<span className="material-symbols-outlined">chevron_left</span>
							</button>
							<button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">1</button>
							<button className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">2</button>
							<button className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">3</button>
							<span className="text-sm">...</span>
							<button className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">8</button>
							<button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
								<span className="material-symbols-outlined">chevron_right</span>
							</button>
						</nav>
					</div>
				</div>
			</main>

			<footer className="mt-auto border-t border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark">
				<div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
						<div className="col-span-2 lg:col-span-1">
							<div className="mb-4 flex items-center gap-3 text-primary dark:text-white">
								<span className="material-symbols-outlined text-2xl">storefront</span>
								<h1 className="text-xl font-bold">Shopify</h1>
							</div>
							<p className="text-sm text-subtle-light dark:text-subtle-dark">
								Your one-stop shop for the latest trends in fashion and apparel.
							</p>
						</div>

						<div>
							<h4 className="mb-4 font-bold">Shop</h4>
							<ul className="space-y-2 text-sm text-subtle-light dark:text-subtle-dark">
								<li><a className="hover:text-accent" href="#">New Arrivals</a></li>
								<li><a className="hover:text-accent" href="#">Men</a></li>
								<li><a className="hover:text-accent" href="#">Women</a></li>
								<li><a className="hover:text-accent" href="#">Accessories</a></li>
							</ul>
						</div>

						<div>
							<h4 className="mb-4 font-bold">About Us</h4>
							<ul className="space-y-2 text-sm text-subtle-light dark:text-subtle-dark">
								<li><a className="hover:text-accent" href="#">Our Story</a></li>
								<li><a className="hover:text-accent" href="#">Careers</a></li>
								<li><a className="hover:text-accent" href="#">Press</a></li>
							</ul>
						</div>

						<div>
							<h4 className="mb-4 font-bold">Support</h4>
							<ul className="space-y-2 text-sm text-subtle-light dark:text-subtle-dark">
								<li><a className="hover:text-accent" href="#">Contact Us</a></li>
								<li><a className="hover:text-accent" href="#">FAQ</a></li>
								<li><a className="hover:text-accent" href="#">Shipping &amp; Returns</a></li>
							</ul>
						</div>

						<div>
							<h4 className="mb-4 font-bold">Follow Us</h4>
							<div className="flex gap-4">
								<a className="text-subtle-light hover:text-accent dark:text-subtle-dark" href="#" aria-label="Twitter">
									<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
										<path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 2.9,4.79C2.53,5.42 2.33,6.15 2.33,6.94C2.33,8.43 3.08,9.77 4.19,10.59C3.49,10.57 2.82,10.37 2.2,10.03C2.2,10.05 2.2,10.07 2.2,10.08C2.2,12.24 3.73,14.05 5.82,14.48C5.46,14.58 5.08,14.61 4.69,14.61C4.42,14.61 4.15,14.58 3.89,14.53C4.45,16.29 6.13,17.56 8.12,17.6C6.63,18.78 4.75,19.5 2.75,19.5C2.41,19.5 2.07,19.48 1.75,19.44C3.76,20.75 6.1,21.5 8.6,21.5C16,21.5 20.33,15.48 20.33,10.03C20.33,9.84 20.33,9.65 20.32,9.46C21.1,8.88 21.83,8.18 22.46,7.34V7.33L22.46,6Z" />
									</svg>
								</a>
								<a className="text-subtle-light hover:text-accent dark:text-subtle-dark" href="#" aria-label="Instagram">
									<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12,2.04C6.5,2.04 2.04,6.5 2.04,12C2.04,17.5 6.5,21.96 12,21.96C17.5,21.96 21.96,17.5 21.96,12C21.96,6.5 17.5,2.04 12,2.04M12,20.15C7.5,20.15 3.85,16.5 3.85,12C3.85,7.5 7.5,3.85 12,3.85C16.5,3.85 20.15,7.5 20.15,12C20.15,16.5 16.5,20.15 12,20.15M12,7.38C9.43,7.38 7.38,9.43 7.38,12C7.38,14.57 9.43,16.62 12,16.62C14.57,16.62 16.62,14.57 16.62,12C16.62,9.43 14.57,7.38 12,7.38M12,14.81C10.45,14.81 9.19,13.55 9.19,12C9.19,10.45 10.45,9.19 12,9.19C13.55,9.19 14.81,10.45 14.81,12C14.81,13.55 13.55,14.81 12,14.81M16.96,6.22C16.96,5.77 16.6,5.41 16.15,5.41C15.7,5.41 15.34,5.77 15.34,6.22C15.34,6.67 15.7,7.03 16.15,7.03C16.6,7.03 16.96,6.67 16.96,6.22Z" />
									</svg>
								</a>
							</div>
						</div>
					</div>

					<div className="mt-8 border-t border-border-light pt-8 text-center text-sm text-subtle-light dark:border-border-dark dark:text-subtle-dark">
						<p>© 2024 Shopify. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default MainPage;
