package br.com.dominadores.xopxe.review;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/** Testa se as regras de acesso das avaliações funcionam no backend. */
@SpringBootTest
@AutoConfigureMockMvc
class ReviewSecurityTest {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void savingWithoutSessionIsUnauthorized() throws Exception {
		mockMvc.perform(put("/api/books/1/reviews/mine")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"rating\": 5, \"comment\": \"sem login\"}"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void deletingWithoutSessionIsUnauthorized() throws Exception {
		mockMvc.perform(delete("/api/books/1/reviews/mine"))
				.andExpect(status().isUnauthorized());
	}

	// Usuário comum pode avaliar. O livro não existe, então 404 quer dizer que
	// passou pela segurança.
	@Test
	@WithMockUser(username = "user@xopxe.com", roles = "USER")
	void commonUserCanSaveOwnReview() throws Exception {
		mockMvc.perform(put("/api/books/999999999/reviews/mine")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"rating\": 5, \"comment\": \"bom\"}"))
				.andExpect(status().isNotFound());
	}

	@Test
	@WithMockUser(username = "user@xopxe.com", roles = "USER")
	void commonUserCanDeleteOwnReview() throws Exception {
		mockMvc.perform(delete("/api/books/999999999/reviews/mine"))
				.andExpect(status().isNotFound());
	}

	@Test
	@WithMockUser(roles = "USER")
	void commonUserCannotModerate() throws Exception {
		mockMvc.perform(delete("/api/reviews/1"))
				.andExpect(status().isForbidden());
	}

	// O id não existe, então 404 quer dizer que o admin passou pela segurança.
	@Test
	@WithMockUser(roles = "ADMIN")
	void adminPassesTheModerationRule() throws Exception {
		mockMvc.perform(delete("/api/reviews/999999999"))
				.andExpect(status().isNotFound());
	}
}
