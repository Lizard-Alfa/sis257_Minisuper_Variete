<script setup lang="ts">
</script>
<template>
  <!-- footer section start -->
  <div class="footer_section layout_padding">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="footer_social_icon">
            <ul>
              <li><a href="#" aria-label="Facebook"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
              <li><a href="#" aria-label="Twitter"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
              <li><a href="#" aria-label="Instagram"><i class="fa fa-instagram" aria-hidden="true"></i></a></li>
            </ul>
          </div>
          <div class="location_text">
            <ul>
              <li>
                <a href="tel:+59164410001">
                  <i class="pi pi-phone" aria-hidden="true"></i>
                  <span class="padding_left_10">+591 6441 0001</span>
                </a>
              </li>
              <li>
                <a href="mailto:contacto@variete.com">
                  <i class="pi pi-envelope" aria-hidden="true"></i>
                  <span class="padding_left_10">contacto@variete.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- footer section end -->

  <!-- copyright section start -->
  <div class="copyright_section">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <p class="copyright_text">
            © 2026 Minisúper Variété. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- copyright section end -->
</template>

<style scoped>
.footer_social_icon ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.footer_social_icon ul li a {
  color: inherit;
  font-size: 1.2rem;
  text-decoration: none;
}

.location_text ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.location_text ul li a {
  color: inherit;
  text-decoration: none;
}

.copyright_text {
  text-align: center;
  margin: 0;
  padding: 10px 0;
}
</style>
