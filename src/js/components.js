export class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="navbar navbar-expand-sm navbar-light bg-light" id="nav" >
			<div class="container">
				<a href="#" class="navbar-brand mb-0 h1"> CourseExplorer </a>

				<button
					type="button"
					class="navbar-toggler"
					data-bs-target="#navbarNav"
					data-bs-toggle="collapse"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon"></span>
				</button>

				<div class="collapse navbar-collapse" id="navbarNav">
					<ul class="navbar-nav">
						<li class="nav-item active">
							<a href="index.html" class="nav-link"> Home </a>
						</li>
						<li class="nav-item active dropdown">
							<a
								class="nav-link dropdown-toggle"
								id="navbarDropdown"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								Courses
							</a>
							<ul
								id="dropdown-menu"
								class="dropdown-menu"
								aria-labelledby="navbarDropdown"
							></ul>
						</li>
						<li class="nav-item active">
							<a href="about.html" class="nav-link"> About </a>
						</li>
						<li class="nav-item active">
							<a href="survey.html" class="nav-link"> Survey </a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
    `;
  }
}
